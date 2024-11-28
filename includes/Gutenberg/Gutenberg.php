<?php
/**
 * Comment Converter Gutenberg.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Gutenberg;

use CommentConverter\Plugin\Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Gutenberg.
 *
 * @since 0.9.1
 */
class Gutenberg {

	/**
	 * Initialize the Gutenberg plugins and/or blocks.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		Plugin::get( FollowByEmail::class )->init();

		// Initialize the Gutenberg plugins and/or blocks that should only be initialized in the WP Admin area.
		if ( is_admin() ) {
			Plugin::get( PostSettings::class )->init();
		}
	}
}
