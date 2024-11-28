<?php
/**
 * Comment Converter Install Skin.
 *
 * @since 0.9.1
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Utils\AMPlugins;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Install Skin.
 *
 * WordPress class extended for on-the-fly addon installations.
 *
 * @since 0.9.1
 */
class InstallSkin extends \WP_Upgrader_Skin {

	/**
	 * Empty out the header of its HTML content and only check to see if it has
	 * been performed or not.
	 *
	 * @since 0.9.1
	 */
	public function header() {}

	/**
	 * Empty out the footer of its HTML contents.
	 *
	 * @since 0.9.1
	 */
	public function footer() {}

	/**
	 * Instead of outputting HTML for errors, json_encode the errors and send them
	 * back to the Ajax script for processing.
	 *
	 * @since 0.9.1
	 *
	 * @param array $errors Array of errors with the install process.
	 */
	public function error( $errors ) {
		if ( ! empty( $errors ) ) {
			wp_send_json_error( $errors );
		}
	}

	/**
	 * Empty out the feedback method to prevent outputting HTML strings as the install
	 * is progressing.
	 *
	 * @since 0.9.1
	 *
	 * @param string $string The feedback string.
	 * @param mixed  ...$args The additional arguments.
	 */
	public function feedback( $string, ...$args ) {}

	/**
	 * Empty out JavaScript output that calls function to decrement the update counts.
	 *
	 * @since 0.9.1
	 *
	 * @param string $type Type of update count to decrement.
	 */
	public function decrement_update_count( $type ) {}
}
