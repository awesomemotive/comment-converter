<?php
/**
 * Comment Converter Post Meta.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Settings;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Post Meta.
 *
 * @since 0.9.1
 */
class PostMeta {

	const ENABLE_COMMENT_FOLLOWING   = 'ccvtr_enable_comment_following';
	const ENABLE_COMMENT_SUBSCRIBING = 'ccvtr_enable_comment_subscribing';

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Settings $settings Instance of Settings.
	 */
	public function __construct( Settings $settings ) {
		$this->settings = $settings;
	}

	/**
	 * Initializes the Post Meta registration.
	 *
	 * @since 0.9.1
	 */
	public function init() {
		$this->register_meta();
	}

	/**
	 * Registers the custom post meta fields.
	 *
	 * @since 0.9.1
	 */
	public function register_meta() {
		foreach ( $this->settings->get_enabled_post_types() as $post_type ) {
			register_meta(
				$post_type,
				self::ENABLE_COMMENT_FOLLOWING,
				array(
					'show_in_rest' => true,
					'single'       => true,
					'type'         => 'boolean',
					'default'      => true,
				)
			);

			register_meta(
				$post_type,
				self::ENABLE_COMMENT_SUBSCRIBING,
				array(
					'show_in_rest' => true,
					'single'       => true,
					'type'         => 'boolean',
					'default'      => true,
				)
			);
		}
	}

	/**
	 * Returns whether comment following is enabled for a post.
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The ID of the post to check.
	 *
	 * @return bool Whether comment following is enabled for the post.
	 */
	public function is_comment_following_enabled( $post_id ) {
		$ret = get_post_meta( $post_id, self::ENABLE_COMMENT_FOLLOWING, true );

		return ! empty( $ret );
	}

	/**
	 * Returns whether comment subscribing is enabled for a post.
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The ID of the post to check.
	 *
	 * @return bool Whether comment subscribing is enabled for the post.
	 */
	public function is_comment_subscribing_enabled( $post_id ) {
		$ret = get_post_meta( $post_id, self::ENABLE_COMMENT_SUBSCRIBING, true );

		return ! empty( $ret );
	}

	/**
	 * Sets the comment following enabled state for a specific post.
	 *
	 * @since 0.9.1
	 *
	 * @param int  $post_id The ID of the post.
	 * @param bool $enabled The desired comment following enabled state (default is true).
	 *
	 * @return bool|int False on failure, meta ID if the key didn't exist, true on successful update.
	 */
	public function set_comment_following_enabled( $post_id, $enabled = true ) {
		return update_post_meta( $post_id, self::ENABLE_COMMENT_FOLLOWING, $enabled );
	}
}
