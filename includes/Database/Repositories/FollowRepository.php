<?php
/**
 * Comment Converter Follow Repository.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Database\Repositories;

use CommentConverter\Plugin\Database\Models\Follow;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follow Repository.
 *
 * @since 0.9.1
 */
class FollowRepository extends BaseRepository {

	/**
	 * The follower repository instance.
	 *
	 * This is needed to hydrate the followers from the follows.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowerRepository $follower_repository The follower repository instance.
	 */
	protected FollowerRepository $follower_repository;

	/**
	 * Constructs a new instance of the repository.
	 *
	 * @since 0.9.1
	 *
	 * @param FollowerRepository $follower_repository The follower repository.
	 */
	public function __construct( FollowerRepository $follower_repository ) {
		parent::__construct();

		$this->follower_repository = $follower_repository;
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_model_class() {
		return Follow::class;
	}

	/**
	 * Queries the database for follow records that match the specified criteria.
	 *
	 * @since 0.9.1
	 *
	 * @param array $args An array of arguments to use in the query.
	 * @param array $include An array of related models to include in the results.
	 *
	 * @return array An array of follow records that match the specified criteria.
	 */
	public function query( array $args = array(), array $include = array() ) {
		global $wpdb;

		$select = $this->build_select_query( '*', $args );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery -- Already prepared.
		$results = $wpdb->get_results( $select );

		if ( empty( $results ) ) {
			return array();
		}

		$follows = $this->hydrate_results( $results );

		$follows = $this->hydrate_relations( $follows, $include );

		return $follows;
	}

	/**
	 * Retrieves all follow records for a specified follower and post.
	 *
	 * @since 0.9.1
	 *
	 * @param int   $follower_id The ID of the follower to retrieve follow records for.
	 * @param int   $post_id The ID of the post to retrieve follow records for.
	 * @param array $include An array of related models to include in the results.
	 *
	 * @return array An array of follow records for the specified follower and post.
	 */
	public function get_by_follower_post( int $follower_id, $post_id, array $include = array() ) {
		return $this->query(
			array(
				'post_id'     => $post_id,
				'follower_id' => $follower_id,
			),
			$include
		);
	}

	/**
	 * Retrieves all follow records for a specified follower.
	 *
	 * @since 0.9.1
	 *
	 * @param int   $follower_id The follower id.
	 * @param array $include     An array of related models to include in the results.
	 *
	 * @return array
	 */
	public function get_by_follower_id( int $follower_id, array $include = array() ) {
		return $this->query(
			array(
				'follower_id' => $follower_id,
			),
			$include
		);
	}

	/**
	 * Retrieves all follow records for a specified post.
	 *
	 * @since 0.9.1
	 *
	 * @param int   $post_id The ID of the post to retrieve follow records for.
	 * @param array $include An array of related models to include in the results.
	 *
	 * @return array An array of follow records for the specified post.
	 */
	public function get_by_post( int $post_id, array $include = array() ) {
		return $this->query(
			array(
				'post_id' => $post_id,
			),
			$include
		);
	}

	/**
	 * Retrieves all follow records for a specified comment.
	 *
	 * @since 0.9.1
	 *
	 * @param int   $comment_id The ID of the comment to retrieve follow records for.
	 * @param array $include An array of related models to include in the results.
	 *
	 * @return array An array of follow records for the specified comment.
	 */
	public function get_by_comment( int $comment_id, array $include = array() ) {
		return $this->query(
			array(
				'comment_id' => $comment_id,
			),
			$include
		);
	}

	/**
	 * Retrieves a paginated list of follows based on the specified arguments.
	 *
	 * @since 0.9.1
	 *
	 * @param array $args The query arguments.
	 * @param array $include The related data to include.
	 *
	 * @return array An array of follows.
	 */
	public function list( $args = array(), $include = array() ) {
		global $wpdb;

		$args = wp_parse_args(
			$args,
			array(
				'page'       => 1,
				'limit'      => static::DEFAULT_LIMIT,
				'sort_by'    => 'id',
				'sort_order' => 'desc',
			)
		);

		// Remove pagination args to get count.
		$no_page_args = array_diff_key( $args, array_flip( array( 'page', 'limit' ) ) );

		$cnt_select = $this->build_select_query( 'count(*)', $no_page_args );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery -- Already prepared.
		$total = (int) $wpdb->get_var( $cnt_select );

		$data = $this->query( $args, $include );

		$ret = array(
			'data'        => $data,
			'total'       => $total,
			'total_pages' => ceil( $total / $args['limit'] ),
			'page'        => $args['page'],
			'size'        => $args['limit'],
		);

		return $ret;
	}

	/**
	 * Gets the counts of follows by posts.
	 *
	 * @since 0.9.1
	 *
	 * @param array $post_ids The IDs of the posts.
	 *
	 * @return array Returns an array with the counts of follows by posts.
	 */
	public function get_counts_by_posts( $post_ids ) {
		return $this->get_counts_by_column(
			array(
				'column' => 'post_id',
				'ids'    => $post_ids,
			)
		);
	}

	/**
	 * Gets the counts of follows by comments.
	 *
	 * @since 0.9.1
	 *
	 * @param array $comment_ids The IDs of the comments.
	 *
	 * @return array Returns an array with the counts of follows by comments.
	 */
	public function get_counts_by_comments( $comment_ids ) {
		return $this->get_counts_by_column(
			array(
				'column' => 'comment_id',
				'ids'    => $comment_ids,
				'type'   => Follow::TYPE_COMMENT_REPLIES,
			)
		);
	}

	/**
	 * Gets the counts of follows by a specific column.
	 *
	 * @since 0.9.1
	 *
	 * @param array $args The arguments for the counts of follows by a specific column.
	 *
	 * @return array Returns an array with the counts of follows by a specific column.
	 */
	protected function get_counts_by_column( $args = array() ) {
		global $wpdb;

		$column = $args['column'] ?? 'post_id';

		$where_args = array();

		if ( ! empty( $args['ids'] ) ) {
			$ids                   = array_map( 'intval', $args['ids'] );
			$where_args[ $column ] = $ids;
		}

		if ( ! empty( $args['type'] ) ) {
			$where_args['type'] = sanitize_key( $args['type'] );
		}

		$where = $this->process_where_clause( $where_args );

		$where = ! empty( $where ) ? sprintf( 'WHERE %s', $where ) : '';

		$limit = '';
		if ( ! empty( $args['limit'] ) ) {
			$limit = $wpdb->prepare( 'LIMIT 0, %d', absint( $args['limit'] ) );
		}

		$sort_by = '';
		if ( ! empty( $args['sort_by'] ) ) {
			$sort_by = sanitize_key( $args['sort_by'] );

			$sort_by = "ORDER BY {$sort_by} DESC";
		}

		// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$select = $wpdb->prepare( "SELECT %i, count(*) as count FROM %i {$where} GROUP BY %i {$sort_by} {$limit}", $column, $this->table_name, $column );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery -- Already prepared.
		$results = $wpdb->get_results( $select );

		if ( empty( $results ) ) {
			return array();
		}

		$counts = array();

		foreach ( $results as $result ) {
			$counts[ $result->{$column} ] = (int) $result->count;
		}

		return $counts;
	}

	/**
	 * Adds a new follow record to the database.
	 *
	 * @since 0.9.1
	 *
	 * @param int    $follower_id The ID of the follower to add.
	 * @param int    $post_id The ID of the post to add.
	 * @param int    $comment_id The ID of the comment to add.
	 * @param string $type The type of follow record to add.
	 * @param bool   $has_subscribed Whether the follower has subscribed to notifications for this record.
	 * @param bool   $confirmed Whether the follow record has been confirmed.
	 *
	 * @return Follow The new follow record model.
	 */
	public function add( int $follower_id, int $post_id, int $comment_id, string $type, bool $has_subscribed, bool $confirmed ) {
		$new_follow = ( new Follow() )->fill(
			array(
				'follower_id'    => $follower_id,
				'post_id'        => $post_id,
				'comment_id'     => $comment_id,
				'type'           => $type,
				'has_subscribed' => $has_subscribed,
				'confirmed'      => $confirmed ? current_time( 'mysql' ) : null,
			)
		);

		$new_follow->save();

		return $new_follow;
	}

	/**
	 * Confirms one or more follow records in the database.
	 *
	 * @since 0.9.1
	 *
	 * @param array|int $follow_ids An array of follow record IDs to confirm, or a single ID.
	 *
	 * @return int The number of follow records affected.
	 */
	public function confirm( $follow_ids ) {
		return $this->update_batch(
			$follow_ids,
			array(
				'confirmed' => current_time( 'mysql' ),
			),
			// Avoid confiming already confirmed follows to not change their confirmation dates.
			array(
				'confirmed' => null,
			),
		);
	}

	/**
	 * Updates the type of the specified follows.
	 *
	 * @since 0.9.1
	 *
	 * @param array  $follow_ids The IDs of the follows to update.
	 * @param string $type The new type to set for the follows.
	 *
	 * @return int|false The number of rows updated, or false on failure.
	 */
	public function switch_type( $follow_ids, $type ) {
		return $this->update_batch(
			$follow_ids,
			array(
				'type' => $type,
			),
		);
	}

	/**
	 * Updates the type of the specified follows to "follow all comments".
	 *
	 * @since 0.9.1
	 *
	 * @param array $follow_ids The IDs of the follows to update.
	 *
	 * @return int|false The number of rows updated, or false on failure.
	 */
	public function switch_to_follow_all( $follow_ids ) {
		return $this->switch_type( $follow_ids, Follow::TYPE_ALL_COMMENTS );
	}

	/**
	 * Updates the type of the specified follows to "follow comment replies only".
	 *
	 * @since 0.9.1
	 *
	 * @param array $follow_ids The IDs of the follows to update.
	 *
	 * @return int|false The number of rows updated, or false on failure.
	 */
	public function switch_to_follow_replies( $follow_ids ) {
		return $this->switch_type( $follow_ids, Follow::TYPE_COMMENT_REPLIES );
	}

	/**
	 * Updates the type of the specified follows to "no follow".
	 *
	 * @since 0.9.1
	 *
	 * @param array $follow_ids The IDs of the follows to update.
	 *
	 * @return int|false The number of rows updated, or false on failure.
	 */
	public function switch_to_no_follow( $follow_ids ) {
		return $this->switch_type( $follow_ids, Follow::TYPE_NO_FOLLOW );
	}

	/**
	 * Get total followers.
	 *
	 * Counts the followers that have follows only.
	 *
	 * @since 0.9.1
	 *
	 * @return int The total followers.
	 */
	public function get_followers_count() {
		global $wpdb;

		$followers_table = $this->follower_repository->get_table_name();

		// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
		$query = $wpdb->prepare( "SELECT count(DISTINCT %i.follower_id) as total FROM %i INNER JOIN %i ON %i.follower_id = %i.id", $this->table_name, $this->table_name, $followers_table, $this->table_name, $followers_table );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared , WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.NotPrepared -- No param preparation needed.
		return (int) $wpdb->get_var( $query );
	}

	/**
	 * Retrieves the followers with the most follows sorted by count.
	 *
	 * @since 0.9.1
	 *
	 * @return array Top 10 followers by most follows sorted by count.
	 */
	public function get_followers_with_most_follows() {
		$data = $this->get_counts_by_column(
			array(
				'column'  => 'follower_id',
				'sort_by' => 'count',
				'limit'   => 10,
			)
		);

		if ( empty( $data ) ) {
			return $data;
		}

		$data = array_map(
			function( $count, $follower_id ) {
				return (object) array(
					'count'       => $count,
					'follower_id' => $follower_id,
				);
			},
			array_values( $data ),
			array_keys( $data )
		);

		return $this->hydrate_followers( $data );
	}

	/**
	 * Retrieves the posts with the most follows sorted by count.
	 *
	 * @since 0.9.1
	 *
	 * @return array Top 10 post with most follows sorted by count.
	 */
	public function get_posts_with_most_follows() {
		$data = $this->get_counts_by_column(
			array(
				'column'  => 'post_id',
				'sort_by' => 'count',
				'limit'   => 10,
			)
		);

		if ( empty( $data ) ) {
			return $data;
		}

		$data = array_map(
			function( $count, $post_id ) {
				return (object) array(
					'count'   => $count,
					'post_id' => $post_id,
				);
			},
			array_values( $data ),
			array_keys( $data )
		);

		return $this->hydrate_posts( $data );
	}

	/**
	 * Retrieves the most recent follows on comments.
	 *
	 * @since 0.9.1
	 *
	 * @return array The 5 most recent follows created for comment replies.
	 */
	public function get_most_recent_follows_on_comments() {
		$args = array(
			'sort_by'    => 'created',
			'sort_order' => 'DESC',
			'type'       => 'replies',
			'limit'      => 5,
		);

		$include = array( 'follower', 'comment', 'post' );

		return $this->query( $args, $include );
	}

	/**
	 * Hydrates the specified follows with their related data.
	 *
	 * @since 0.9.1
	 *
	 * @param array $follows The follows to hydrate.
	 * @param array $include The related data to include.
	 *
	 * @return array The hydrated follows.
	 */
	protected function hydrate_relations( $follows, $include = array() ) {
		if ( in_array( 'follower', $include, true ) ) {
			$follows = $this->hydrate_followers( $follows );
		}

		if ( in_array( 'post', $include, true ) ) {
			$follows = $this->hydrate_posts( $follows );
		}

		if ( in_array( 'comment', $include, true ) ) {
			$follows = $this->hydrate_comments( $follows );
		}

		return $follows;
	}

	/**
	 * Hydrates the specified follows with their related followers.
	 *
	 * @since 0.9.1
	 *
	 * @param array $follows The follows to hydrate.
	 *
	 * @return array The hydrated follows.
	 */
	protected function hydrate_followers( $follows ) {
		$follower_ids = array();
		foreach ( $follows as $follow ) {
			$follower_ids[] = $follow->follower_id;
		}

		if ( empty( $follower_ids ) ) {
			return $follows;
		}

		$followers = $this->follower_repository->get_by_ids( $follower_ids );

		$followers_by_id = array();
		foreach ( $followers as $follower ) {
			$followers_by_id[ $follower->id ] = $follower;
		}

		$follows = array_map(
			function( $follow ) use ( $followers_by_id ) {
				$follow->follower = $followers_by_id[ $follow->follower_id ];
				return $follow;
			},
			$follows
		);

		return $follows;
	}

	/**
	 * Hydrates the specified follows with their related posts.
	 *
	 * @since 0.9.1
	 *
	 * @param array $follows The follows to hydrate.
	 *
	 * @return array The hydrated follows.
	 */
	protected function hydrate_posts( $follows ) {
		$post_ids = array();
		foreach ( $follows as $follow ) {
			$post_ids[] = $follow->post_id;
		}

		if ( empty( $post_ids ) ) {
			return $follows;
		}

		$posts = get_posts(
			array(
				'include'   => $post_ids,
				'post_type' => 'any',
			)
		);

		$posts_by_id = array();
		foreach ( $posts as $post ) {
			$posts_by_id[ $post->ID ] = $post;
		}

		// Filter out follows for posts that no longer exist.
		$follows = array_filter(
			$follows,
			function( $follow ) use ( $posts_by_id ) {
				return ! empty( $posts_by_id[ $follow->post_id ] );
			}
		);

		$follows = array_map(
			function( $follow ) use ( $posts_by_id ) {
				$follow->post       = $posts_by_id[ $follow->post_id ];
				$follow->post->link = get_permalink( $follow->post );
				return $follow;
			},
			$follows
		);

		return array_values( $follows );
	}

	/**
	 * Hydrates the specified follows with their related comments.
	 *
	 * @since 0.9.1
	 *
	 * @param array $follows The follows to hydrate.
	 *
	 * @return array The hydrated follows.
	 */
	protected function hydrate_comments( $follows ) {
		$comment_ids = array();
		foreach ( $follows as $follow ) {
			$comment_ids[] = $follow->comment_id;
		}

		if ( empty( $comment_ids ) ) {
			return $follows;
		}

		$comments = get_comments(
			array(
				'comment__in' => $comment_ids,
			)
		);

		$comments_by_id = array();
		foreach ( $comments as $comment ) {
			$comments_by_id[ $comment->comment_ID ] = $comment;
		}

		$follows = array_map(
			function( $follow ) use ( $comments_by_id ) {
				if ( ! empty( $follow->comment_id ) && ! empty( $comments_by_id[ $follow->comment_id ] ) ) {
					$follow->comment       = $comments_by_id[ $follow->comment_id ];
					$follow->comment->link = get_comment_link( $follow->comment );
				}
				return $follow;
			},
			$follows
		);

		return $follows;
	}

	/**
	 * Builds a SELECT query for the specified columns and arguments.
	 *
	 * @since 0.9.1
	 *
	 * @param string $columns The columns to select.
	 * @param array  $args The query arguments.
	 *
	 * @return string The built SELECT query.
	 */
	protected function build_select_query( string $columns = '*', array $args = array() ) {
		global $wpdb;

		$where = array();

		if ( ! empty( $args['follower_id'] ) ) {
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder -- Already prepared.
			$where[] = $wpdb->prepare( "%i.follower_id = %d", $this->table_name, intval( $args['follower_id'] ) );
		}

		if ( ! empty( $args['post_id'] ) ) {
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder -- Already prepared.
			$where[] = $wpdb->prepare( "%i.post_id = %d", $this->table_name, intval( $args['post_id'] ) );
		}

		if ( ! empty( $args['comment_id'] ) ) {
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder -- Already prepared.
			$where[] = $wpdb->prepare( "%i.comment_id = %d", $this->table_name, intval( $args['comment_id'] ) );
		}

		// Some args will require a JOIN with the followers table.
		$followers_table = $this->follower_repository->get_table_name();

		if ( ! empty( $args['type'] ) ) {
			switch ( $args['type'] ) {
				case 'all':
				case 'replies':
					// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder -- Already prepared.
					$where[] = $wpdb->prepare( "%i.type = %s", $this->table_name, $args['type'] );
					break;
				case 'pending':
					// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
					$where[] = $wpdb->prepare( "%i.confirmed IS NULL", $this->table_name );
					break;
				case 'confirmed':
					// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
					$where[] = $wpdb->prepare( "%i.confirmed IS NOT NULL", $this->table_name );
					break;
				case 'subscribed':
					// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder -- Already prepared.
					$where[] = $wpdb->prepare( "%i.has_subscribed = %d", $this->table_name, 1 );
					break;
			}
		}

		if ( ! empty( $args['date'] ) ) {
			switch ( $args['date'] ) {
				case 'last-7-days':
					// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
					$where[] = $wpdb->prepare( "%i.created >= DATE_SUB(NOW(), INTERVAL 7 DAY)", $this->table_name );
					break;
				case 'last-30-days':
					// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
					$where[] = $wpdb->prepare( "%i.created >= DATE_SUB(NOW(), INTERVAL 30 DAY)", $this->table_name );
					break;
			}
		}

		if ( ! empty( $args['search'] ) ) {
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder -- Already prepared.
			$where[] = $wpdb->prepare( "(%i.notification_email like %s OR %i.name like %s)", $followers_table, '%' . $args['search'] . '%', $followers_table, '%' . $args['search'] . '%' );
		}

		$where = ! empty( $where ) ? sprintf( 'WHERE %s', implode( ' AND ', $where ) ) : '';

		$limit = '';

		// If a page is specified, we need to calculate the offset and limit.
		if ( ! empty( $args['page'] ) ) {
			$page   = absint( $args['page'] );
			$limit  = absint( $args['limit'] ?? static::DEFAULT_LIMIT );
			$offset = ( $page - 1 ) * $limit;
			$limit  = $wpdb->prepare( 'LIMIT %d, %d', $offset, $limit );
		} elseif ( ! empty( $args['limit'] ) ) {
			$limit = $wpdb->prepare( 'LIMIT 0, %d', absint( $args['limit'] ) );
		}

		$order = '';

		if ( ! empty( $args['sort_by'] ) ) {

			$sort_by = strtolower( $args['sort_by'] ?? 'id' );

			// Validates if the sort_by arg represents a real sortable column.
			$sort_by = in_array( $sort_by, array( 'id', 'follower', 'created', 'has_subscribed', 'follow_type' ), true ) ? $sort_by : 'id';

			if ( 'follower' === $sort_by ) {
				// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
				$sort_by = $wpdb->prepare( "%i.name", $followers_table );
			}

			if ( 'follow_type' === $sort_by ) {
				// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
				$sort_by = $wpdb->prepare( "%i.type", $this->table_name );
			}

			// Prefix some columns to account for potentially ambiguous columns between joined tables.
			if ( in_array( $sort_by, array( 'id', 'created' ), true ) ) {
				// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
				$sort_by = $wpdb->prepare( "%i.%i", $this->table_name, $sort_by );
			}

			$sort_order = strtolower( $args['sort_order'] ?? 'asc' );

			// Validates if the sort_order arg represents a valid value.
			$sort_order = in_array( $sort_order, array( 'asc', 'desc' ), true ) ? $sort_order : 'asc';

			$order = "ORDER BY {$sort_by} {$sort_order}";
		}

		global $wpdb;
		$wp_posts_table = $wpdb->prefix . 'posts';

		// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
		$join = $wpdb->prepare( "INNER JOIN %i ON %i.post_id = %i.ID", $wp_posts_table, $this->table_name, $wp_posts_table );

		$should_join_with_followers = ! empty( $args['search'] )
			|| ( ! empty( $args['sort_by'] ) && 'follower' === strtolower( $args['sort_by'] ) );

		if ( $should_join_with_followers ) {
			// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
			$join .= $wpdb->prepare( " INNER JOIN %i ON %i.follower_id = %i.id", $followers_table, $this->table_name, $followers_table );
		}

		if ( '*' === $columns ) {
			// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
			$columns = $wpdb->prepare( "%i.*", $this->table_name );
		}

		$wp_comments_table = $wpdb->prefix . 'comments';

		// Join with comments table to only get approved comments
		// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
		$join .= $wpdb->prepare( " INNER JOIN %i ON %i.comment_id = %i.comment_ID AND %i.comment_approved = '1'", $wp_comments_table, $this->table_name, $wp_comments_table, $wp_comments_table );

		// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		return $wpdb->prepare( "SELECT {$columns} FROM %i {$join} {$where} {$order} {$limit}", $this->table_name );
	}
}
