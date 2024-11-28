<?php
/**
 * Comment Converter Admin List Tables.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Admin;

use CommentConverter\Plugin\Database\Models\Follow;
use CommentConverter\Plugin\Database\Repositories\FollowRepository;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\Urls;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Admin List Tables.
 *
 * @since 0.9.1
 */
class ListTables {

	/**
	 * Holds the slug/name of the follow column.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	const FOLLOW_COLUMN_NAME = 'ccvtr-follows';

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Holds the instance of FollowRepository.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowRepository
	 */
	protected $follow_repository;

	/**
	 * Holds the cached values of counts per post/comment id.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected $counts_by_id = array();

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Settings         $settings Instance of Settings.
	 * @param FollowRepository $follow_repository Instance of FollowRepository.
	 */
	public function __construct( Settings $settings, FollowRepository $follow_repository ) {
		$this->settings          = $settings;
		$this->follow_repository = $follow_repository;
	}

	/**
	 * Sets up the hooks for the WP post, comments, and custom post type list tables.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		// Add the follows column to all enabled post types.
		foreach ( $this->settings->get_enabled_post_types() as $post_type ) {
			add_filter( 'manage_edit-' . $post_type . '_columns', array( $this, 'add_follows_column_to_posts' ) );
			add_filter( 'manage_edit-' . $post_type . '_sortable_columns', array( $this, 'make_follows_column_sortable' ) );
			add_action( 'manage_' . $post_type . '_posts_custom_column', array( $this, 'output_follows_column_on_posts' ), 10, 2 );
		}

		// Modify the main query to sort by follows when requested.
		add_action( 'pre_get_posts', array( $this, 'sort_posts_by_follows' ) );
		add_filter( 'posts_clauses', array( $this, 'posts_clauses' ), 10, 2 );

		// Always add the follows column to the comments list table.
		add_filter( 'manage_edit-comments_columns', array( $this, 'add_follows_column' ) );
		add_filter( 'manage_edit-comments_sortable_columns', array( $this, 'make_follows_column_sortable' ) );
		add_action( 'manage_comments_custom_column', array( $this, 'output_comment_follows_column' ), 10, 2 );
		add_filter( 'comments_clauses', array( $this, 'comment_clauses' ), 10, 2 );

		// Eager load the follow counts for the comments in the list table. We check for the screen ID in the callback.
		add_filter( 'the_comments', array( $this, 'eagerload_comment_counts' ), 10, 2 );
	}

	/**
	 * Adds a 'Follows' column to the posts (and custom post types) list table.
	 *
	 * @since 0.9.1
	 *
	 * @param array $columns The existing columns.
	 *
	 * @return array The updated columns.
	 */
	public function add_follows_column_to_posts( $columns ) {
		global $wp_query;

		$post_ids = wp_list_pluck( $wp_query->posts, 'ID' );

		// Queries the counts for all posts at once.
		$this->eagerload_post_counts( $post_ids );

		return $this->add_follows_column( $columns );
	}

	/**
	 * Adds a 'Follows' column to the comments list table.
	 *
	 * @since 0.9.1
	 *
	 * @param array $columns The existing columns.
	 *
	 * @return array The updated columns.
	 */
	public function add_follows_column( $columns ) {
		$columns[ self::FOLLOW_COLUMN_NAME ] = __( 'Follows', 'comment-notifications' );
		return $columns;
	}

	/**
	 * Outputs the 'Follows' column for a post in the posts (and custom post types) list table.
	 *
	 * @since 0.9.1
	 *
	 * @param string $column The column name.
	 * @param int    $post_id The post ID.
	 */
	public function output_follows_column_on_posts( $column, $post_id ) {
		if ( self::FOLLOW_COLUMN_NAME === $column ) {
			$count = $this->counts_by_id[ $post_id ] ?? 0;

			$this->output_follow_badge(
				$count,
				array( 'post_id' => $post_id ),
				/* translators: %s is replaced with the number of active follows. */
				sprintf( _n( 'This post has %s active follow', 'This post has %s active follows', $count, 'comment-notifications' ), $count )
			);
		}
	}

	/**
	 * Makes the 'Follows' column sortable.
	 *
	 * @since 0.9.1
	 *
	 * @param array $columns The existing sortable columns.
	 *
	 * @return array The updated sortable columns.
	 */
	public function make_follows_column_sortable( $columns ) {
		$columns[ self::FOLLOW_COLUMN_NAME ] = self::FOLLOW_COLUMN_NAME;

		return $columns;
	}

	/**
	 * Modifies the main query to sort by follows when requested.
	 *
	 * @since 0.9.1
	 *
	 * @param WP_Query $query The main query.
	 *
	 * @return void
	 */
	public function sort_posts_by_follows( $query ) {
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return;
		}

		if ( self::FOLLOW_COLUMN_NAME === $query->get( 'orderby' ) ) {
			$query->set( 'orderby', 'follows_count' );
		}
	}

	/**
	 * Modifies the posts query to add SQL JOIN and ORDER BY clauses to sort by follows.
	 *
	 * @since 0.9.1
	 *
	 * @param array    $clauses The existing clauses.
	 * @param WP_Query $query The posts query.
	 *
	 * @return array The updated clauses.
	 */
	public function posts_clauses( $clauses, $query ) {
		global $wpdb;

		// Check for 'follows_count' string instead of self::FOLLOW_COLUMN_NAME because the 'follows_count' is only
		// added after checking is it's the main query.
		if ( 'follows_count' === $query->get( 'orderby' ) ) {
			$table_name         = ( new Follow() )->get_table();
			$clauses['join']   .= " LEFT JOIN (SELECT post_id, COUNT(*) as follows_count FROM {$table_name} GROUP BY post_id) f ON {$wpdb->posts}.ID = f.post_id";
			$clauses['orderby'] = 'f.follows_count ' . $query->get( 'order' );
		}

		return $clauses;
	}

	/**
	 * Modifies the comments query to add SQL JOIN and ORDER BY clauses to sort by follows.
	 *
	 * @since 0.9.1
	 *
	 * @param array            $clauses The existing clauses.
	 * @param WP_Comment_Query $query The comments query.
	 *
	 * @return array The updated clauses.
	 */
	public function comment_clauses( $clauses, $query ) {
		global $wpdb;

		if ( self::FOLLOW_COLUMN_NAME === $query->query_vars['orderby'] ) {
			$table_name         = ( new Follow() )->get_table();
			$replies_type       = Follow::TYPE_COMMENT_REPLIES;
			$clauses['join']   .= " LEFT JOIN (SELECT comment_id, COUNT(*) as follows_count FROM {$table_name} where type = '{$replies_type}' GROUP BY comment_id) f ON {$wpdb->comments}.comment_ID = f.comment_id";
			$clauses['orderby'] = 'f.follows_count ' . $query->query_vars['order'];
		}

		return $clauses;
	}

	/**
	 * Outputs the 'Follows' column for a comment in the comments list table.
	 *
	 * @since 0.9.1
	 *
	 * @param string $column The column name.
	 * @param int    $comment_id The comment ID.
	 */
	public function output_comment_follows_column( $column, $comment_id ) {
		if ( self::FOLLOW_COLUMN_NAME === $column ) {
			$count = $this->counts_by_id[ $comment_id ] ?? 0;

			$this->output_follow_badge(
				$count,
				array( 'comment_id' => $comment_id ),
				/* translators: %s is replaced with the number of active follows. */
				sprintf( _n( 'This comment has %s active follow', 'This comment has %s active follows', $count, 'comment-notifications' ), $count )
			);
		}
	}

	/**
	 * Eager loads the follow counts for the comments in the comments list table.
	 *
	 * This is done to query the counts for all comments in the list table at once.
	 *
	 * @since 0.9.1
	 *
	 * @param array $comments The comments.
	 *
	 * @return array The comments.
	 */
	public function eagerload_comment_counts( $comments ) {
		// Only eager load the counts on the comments list table.
		$screen = get_current_screen();
		if ( empty( $screen ) || 'edit-comments' !== $screen->id ) {
			return $comments;
		}

		$comment_ids = wp_list_pluck( $comments, 'comment_ID' );

		$counts = $this->follow_repository->get_counts_by_comments( $comment_ids );

		foreach ( $comment_ids as $comment_id ) {
			$this->counts_by_id[ $comment_id ] = $counts[ $comment_id ] ?? 0;
		}

		return $comments;
	}

	/**
	 * Eager loads the follow counts for the posts in the posts (and custom post types) list table.
	 *
	 * This is done to query the counts for all posts in the list table at once.
	 *
	 * @since 0.9.1
	 *
	 * @param array $post_ids The post IDs.
	 */
	protected function eagerload_post_counts( $post_ids ) {
		$counts = $this->follow_repository->get_counts_by_posts( $post_ids );

		foreach ( $post_ids as $post_id ) {
			$this->counts_by_id[ $post_id ] = $counts[ $post_id ] ?? 0;
		}
	}

	/**
	 * Outputs the HTML for the follow badge.
	 *
	 * @since 0.9.1
	 *
	 * @param int    $count The follow count.
	 * @param array  $args Additional arguments.
	 * @param string $title The title for the badge.
	 */
	protected function output_follow_badge( $count, $args, $title ) {
		$url = Urls::internal_admin( 'followers', $args );

		echo sprintf(
			'<a href="%s" target="_blank" title="%s"><span class="ccvtr-follow-badge">%s</span></a>',
			esc_url( $url ),
			esc_attr( $title ),
			esc_html( $count )
		);
	}
}
