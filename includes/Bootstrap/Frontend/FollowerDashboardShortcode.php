<?php
/**
 * Comment Converter Follower Dashboard Shortcode.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Frontend;

use CommentConverter\Plugin\Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follower Dashboard Shortcode.
 *
 * @since 0.9.1
 */
class FollowerDashboardShortcode {

	/**
	 * Sets up the hooks.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		// Setup the Folower Dashboard as a shortcode so users can have more control over the page.
		add_shortcode( 'ccvtr_follower_dashboard', array( $this, 'render_shortcode' ) );
	}

	/**
	 * Render the shortcode.
	 *
	 * @since 0.9.1
	 *
	 * @return string The Follower Dashboard output.
	 */
	public function render_shortcode() {
		$path_path = isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';

		// When using the shortcode, we need to adjust the page_path to the current URL path.
		$page_args = array(
			'page_path' => $path_path,
		);

		return Plugin::get( FollowerDashboardPage::class )->set_page_args( $page_args )->load_page();
	}
}
