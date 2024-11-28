<?php
/**
 * Comment Converter System Control.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Services;

use CommentConverter\Plugin\Settings\PostMeta;
use CommentConverter\Plugin\Settings\Settings;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter System Control.
 *
 * @since 0.9.1
 */
class SystemControl {

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Holds the instance of PostMeta.
	 *
	 * @since 0.9.1
	 *
	 * @var PostMeta
	 */
	protected $post_meta;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Settings $settings Instance of Settings.
	 * @param PostMeta $post_meta Instance of PostMeta.
	 */
	public function __construct( Settings $settings, PostMeta $post_meta ) {
		$this->settings  = $settings;
		$this->post_meta = $post_meta;
	}

	/**
	 * Checks if Comment Converter is enabled to work on a specific post.
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Returns true if the Comment Converter is enabled, false otherwise.
	 */
	public function is_comment_converter_enabled( $post_id ) {
		if ( $this->settings->should_allow_only_logged_in_users() && ! is_user_logged_in() ) {
			return false;
		}

		$post_type = get_post_type( $post_id );

		if ( ! $this->is_post_type_enabled( $post_type ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Checks if the given post type is enabled.
	 *
	 * @since 0.9.1
	 *
	 * @param string $post_type The post type to check.
	 *
	 * @return bool Returns true if the post type is enabled, false otherwise.
	 */
	public function is_post_type_enabled( $post_type ) {
		return $this->settings->is_post_type_enabled( $post_type );
	}

	/**
	 * Checks if comment following is enabled for a specific post.
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Returns true if comment following is enabled for a specific post, false otherwise.
	 */
	public function is_comment_following_enabled( $post_id ) {
		return $this->post_meta->is_comment_following_enabled( $post_id );
	}

	/**
	 * Checks if comment subscribing is enabled for a specific post.
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Returns true if comment subscribing is enabled for a specific post, false otherwise.
	 */
	public function is_comment_subscribing_enabled( $post_id ) {
		return $this->post_meta->is_comment_subscribing_enabled( $post_id );
	}

}
