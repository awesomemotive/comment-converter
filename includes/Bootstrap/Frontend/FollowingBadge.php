<?php
/**
 * Comment Converter Following Badge.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Frontend;

use CommentConverter\Plugin\Services\FollowControl;
use CommentConverter\Plugin\Services\FollowerControl;
use CommentConverter\Plugin\Utils\Utils;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\Html;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Following Badge.
 *
 * @since 0.9.1
 */
class FollowingBadge {

	/**
	 * Holds the mapping of the default following badge slugs to their images.
	 *
	 * @since 0.9.1
	 */
	const DEFAULT_BADGES = array(
		'rounded-square-logo' => 'badge-icons/rounded-square-logo.svg',
		'white-logo'          => 'badge-icons/white-logo.svg',
		'colored-logo'        => 'badge-icons/colored-logo.svg',
		'person-check'        => 'badge-icons/person-check.svg',
		'person-plus'         => 'badge-icons/person-plus.svg',
	);

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Holds the instance of FollowControl.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowControl
	 */
	protected $follow_control;

	/**
	 * Holds the instance of FollowerControl.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowerControl
	 */
	protected $follower_control;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Settings        $settings Instance of Settings.
	 * @param FollowControl   $follow_control Instance of FollowControl.
	 * @param FollowerControl $follower_control Instance of FollowerControl.
	 */
	public function __construct( Settings $settings, FollowControl $follow_control, FollowerControl $follower_control ) {
		$this->settings         = $settings;
		$this->follow_control   = $follow_control;
		$this->follower_control = $follower_control;
	}

	/**
	 * Sets up the hooks for adding the following badge next to the comment section title and commenter's name.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		// The 'render_block_core/comments-title' filter is used to place the following badge next to the comment section
		// title for block themes.
		add_filter( 'render_block_core/comments-title', array( $this, 'append_to_comments_title_block' ) );

		// The 'render_block_core/comment-author-name' filter is used to place the following badge next to the commenter's
		// name for block themes.
		add_filter( 'render_block_core/comment-author-name', array( $this, 'append_to_comment_author_name_block' ), 10, 3 );

		// Temporarily commenting out the get_comment_author_link solution below so the JS badge placer can kick in.
		// The idea is to test which solution performs better.
		// The 'get_comment_author_link' filter is used to place the following badge next to the commenter's name for classic
		// themes.
		// add_filter( 'get_comment_author_link', array( $this, 'append_to_comment_author_link' ), 10, 3 );.

		// The 'comment_form' action is used to enqueue the following badge placer script and style, that will place the
		// following badge next to the comment section title and commenter's name for classic themes, when the strategies above
		// do not work.
		add_action( 'comment_form', array( $this, 'enqueue_following_badge_placer' ), 10, 2 );
	}

	/**
	 * Appends the following badge to the comments title block.
	 *
	 * @since 0.9.1
	 *
	 * @param string $block_content The content of the block.
	 *
	 * @return string Returns the block content with the following badge appended.
	 */
	public function append_to_comments_title_block( $block_content ) {
		if ( $this->is_following_post( get_the_ID() ) ) {
			$block_content = $this->append_following_badge_to_markup( $block_content, $this->get_following_badge_output_for_post_following() );
		}

		return $block_content;
	}

	/**
	 * Appends the following badge to the comment author name block.
	 *
	 * @since 0.9.1
	 *
	 * @param string $block_content The content of the block.
	 * @param array  $parsed_block The parsed block.
	 * @param object $block The block.
	 *
	 * @return string Returns the block content with the following badge appended.
	 */
	public function append_to_comment_author_name_block( $block_content, $parsed_block, $block ) {
		$comment_id = $block->context['commentId'];

		if ( ! empty( $comment_id ) && $this->is_following_comment( get_the_ID(), $comment_id ) ) {
			$block_content = $this->append_following_badge_to_markup( $block_content, $this->get_following_badge_output_for_comment_following() );
		}

		return $block_content;
	}

	/**
	 * Appends the following badge to the comment author link.
	 *
	 * @since 0.9.1
	 * @param string $link_content The content of the link.
	 * @param string $author The author of the comment.
	 * @param int    $comment_id The ID of the comment.
	 *
	 * @return string Returns the link content with the following badge appended.
	 */
	public function append_to_comment_author_link( $link_content, $author, $comment_id ) {
		if ( ! empty( $comment_id ) && $this->is_following_comment( get_the_ID(), $comment_id ) ) {
			$link_content .= $this->get_following_badge_output_for_comment_following();
		}

		return $link_content;
	}

	/**
	 * Appends a following badge to the given markup.
	 *
	 * @since 0.9.1
	 *
	 * @param string $markup The original markup.
	 * @param string $badge_markup The markup for the following badge.
	 *
	 * @return string The modified markup with the following badge appended.
	 */
	protected function append_following_badge_to_markup( $markup, $badge_markup ) {
		return Html::append_to_parent( $markup, $badge_markup );
	}

	/**
	 * Enqueues the following badge placer if the current post is a single post and the follower is following the post or
	 * any comments.
	 *
	 * The following badge placer is a script that will try to place the following badge next to the comment section title
	 * and the commenter's name using JavaScript and query selectors.
	 *
	 * @since 0.9.1
	 */
	public function enqueue_following_badge_placer() {
		// For now, at least, we're only adding the following badge to single post pages.
		if ( ! is_singular() ) {
			return;
		}

		$post_follows = $this->get_post_follows( get_the_ID() );

		// If not following anything, there's no need to place the following badge.
		if ( empty( $post_follows ) || ( empty( $post_follows['comment_ids'] ) && empty( $post_follows['post_id'] ) ) ) {
			return;
		}

		$asset_file = include Utils::dir_path( 'build/frontend/following-badge-placer.asset.php' );
		wp_enqueue_style( 'ccvtr-following-badge-placer-style', Utils::dir_url( 'build/frontend/style-following-badge-placer.css' ), array(), $asset_file['version'] );
		wp_register_script( 'ccvtr-following-badge-placer-script', Utils::dir_url( 'build/frontend/following-badge-placer.js' ), $asset_file['dependencies'], $asset_file['version'], true );
		wp_set_script_translations( 'ccvtr-following-badge-placer-script', 'subscribe-to-comment-notifications-comment-converter', Utils::dir_path( 'languages' ) );

		$js_data = array();

		if ( ! empty( $post_follows['comment_ids'] ) ) {
			$js_data['followingBadgeOutput'] = $this->get_following_badge_output_for_comment_following();
			$js_data['commentIds']           = $post_follows['comment_ids'];
		}

		if ( ! empty( $post_follows['post_id'] ) ) {
			$js_data['followingBadgeOutput'] = $this->get_following_badge_output_for_post_following();
			$js_data['postId']               = $post_follows['post_id'];
		}

		if ( ! empty( $js_data ) ) {
			wp_localize_script( 'ccvtr-following-badge-placer-script', 'ccData', $js_data );
		}

		wp_enqueue_script( 'ccvtr-following-badge-placer-script' );
	}

	/**
	 * Gets the follows of the current follower for a post.
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return array Returns an array with the post ID if the follower is following all comments,
	 *               or an array with the comment IDs if the follower is following comment replies.
	 */
	protected function get_post_follows( $post_id ) {
		$follower = $this->follower_control->get_current_follower();

		if ( ! $follower ) {
			return false;
		}

		$post_follows = $this->follow_control->get_followers_post_follows( $follower, $post_id );

		$ret = array(
			'post_id'     => null,
			'comment_ids' => array(),
		);

		foreach ( $post_follows as $post_follow ) {
			if ( $post_follow->is_following_all_comments() ) {
				$ret['post_id'] = $post_id;
			}

			if ( $post_follow->is_following_comment_replies() && ! empty( $post_follow->comment_id ) && '0' !== $post_follow->comment_id ) {
				$ret['comment_ids'][] = $post_follow->comment_id;
			}
		}

		return $ret;
	}

	/**
	 * Checks if the current follower is following a post.
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Returns true if the follower is following the post, false otherwise.
	 */
	protected function is_following_post( $post_id ) {
		$follower = $this->follower_control->get_current_follower();

		if ( ! $follower ) {
			return false;
		}

		return $this->follow_control->is_user_following_post( $follower, $post_id );
	}

	/**
	 * Checks if the current follower is following a comment.
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The ID of the post.
	 * @param int $comment_id The ID of the comment.
	 *
	 * @return bool Returns true if the follower is following the comment, false otherwise.
	 */
	protected function is_following_comment( $post_id, $comment_id ) {
		$follower = $this->follower_control->get_current_follower();

		if ( ! $follower ) {
			return false;
		}

		return $this->follow_control->is_user_following_comment( $follower, $post_id, $comment_id );
	}

	/**
	 * Gets the following badge output for a comment following.
	 *
	 * @since 0.9.1
	 *
	 * @return string The following badge output.
	 */
	protected function get_following_badge_output_for_comment_following() {
		return $this->get_following_badge_output(
			array(
				'link'    => $this->settings->get_follower_dashboard_url(),
				'tooltip' => __( "You're following the replies for this comment.", 'subscribe-to-comment-notifications-comment-converter' ),
			)
		);
	}

	/**
	 * Gets the following badge output for a post following.
	 *
	 * @since 0.9.1
	 *
	 * @return string The following badge output.
	 */
	protected function get_following_badge_output_for_post_following() {
		return $this->get_following_badge_output(
			array(
				'link'    => $this->settings->get_follower_dashboard_url(),
				'tooltip' => __( "You're following all comments for this post.", 'subscribe-to-comment-notifications-comment-converter' ),
			)
		);
	}

	/**
	 * Generates the HTML output for the following badge.
	 *
	 * @since 0.9.1
	 *
	 * @param array $args The arguments for the following badge output.
	 *
	 * @return string The following badge output.
	 */
	protected function get_following_badge_output( $args = array() ) {
		$following_badge_path = $this->settings->get_following_badge_path();

		$following_badge = '<img src="' . esc_attr( $following_badge_path ) . '" />';

		if ( $this->is_default_badge( $following_badge_path ) ) {
			$following_badge_path = $this->get_badge_image( $following_badge_path );

			if ( file_exists( $following_badge_path ) ) {
				$following_badge = Utils::get_contents( $following_badge_path );
			}
		} elseif ( 'svg' === pathinfo( $following_badge_path, PATHINFO_EXTENSION ) && file_exists( $following_badge_path ) ) {
			// If it's an svg, let's inline it so us and users could apply CSS styles.
			$following_badge = Utils::get_contents( $following_badge_path );
		}

		$output = sprintf(
			'<a class="ccvtr-following-badge" href="%1$s" style="color: %2$s" title="%4$s">%3$s</a>',
			esc_url( $args['link'] ?? '' ),
			esc_attr( $this->settings->get_following_badge_color() ),
			$following_badge,
			esc_attr( $args['tooltip'] ?? '' )
		);

		return $output;
	}

	/**
	 * Check if given slug if a default badge slug.
	 *
	 * @since 0.9.1
	 *
	 * @param string $badge The badge slug to check.
	 *
	 * @return boolean Whether the given slug is a default badge slug.
	 */
	public function is_default_badge( $badge ) {
		return ! empty( self::DEFAULT_BADGES[ $badge ] );
	}

	/**
	 * Get the image path for a given badge slug.
	 *
	 * @since 0.9.1
	 *
	 * @param string $badge The badge slug.
	 *
	 * @return string The path for the following badge image.
	 */
	public function get_badge_image( $badge ) {
		if ( empty( self::DEFAULT_BADGES[ $badge ] ) ) {
			return null;
		}

		return Utils::dir_path( 'assets/' . self::DEFAULT_BADGES[ $badge ] );
	}
}
