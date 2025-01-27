<?php
/**
 * Comment Converter Gutenberg's Post Settings plugin.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Gutenberg;

use CommentConverter\Plugin\Services\SystemControl;
use CommentConverter\Plugin\Utils\Urls;
use CommentConverter\Plugin\Utils\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Gutenberg's Post Settings plugin.
 *
 * @since 0.9.1
 */
class PostSettings {

	/**
	 * Holds the instance of SystemControl.
	 *
	 * @since 0.9.1
	 *
	 * @var SystemControl
	 */
	protected $system_control;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param SystemControl $system_control Instance of SystemControl.
	 */
	public function __construct( SystemControl $system_control ) {
		$this->system_control = $system_control;
	}

	/**
	 * Initialize the Post Settings plugin.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'register_plugin' ) );
	}

	/**
	 * Register the Post Settings plugin.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function register_plugin() {
		if ( ! $this->system_control->is_post_type_enabled( get_post_type() ) ) {
			return;
		}

		$asset_file = include Utils::dir_path( 'build/Gutenberg/plugin-post-settings.asset.php' );
		wp_register_script( 'ccvtr-gutenberg-plugin-post-settings', Utils::dir_url( 'build/Gutenberg/plugin-post-settings.js' ), $asset_file['dependencies'], $asset_file['version'], false );
		$js_data = array(
			'internalAdminBaseUrl' => Urls::internal_admin(),
			'adminBaseUrl'         => Urls::admin(),
		);
		wp_localize_script( 'ccvtr-gutenberg-plugin-post-settings', 'ccData', $js_data );
		wp_set_script_translations( 'ccvtr-gutenberg-plugin-post-settings', 'subscribe-to-comment-notifications-comment-converter', Utils::dir_path( 'languages' ) );
		wp_enqueue_script( 'ccvtr-gutenberg-plugin-post-settings' );
	}
}
