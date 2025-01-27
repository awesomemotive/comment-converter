<?php
/**
 * Comment Converter Plugin.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin;

use CommentConverter\Plugin\Database\Schema\Schema;
use CommentConverter\Plugin\Gutenberg\Gutenberg;
use CommentConverter\Plugin\Settings\Options;
use CommentConverter\Plugin\Settings\PostMeta;
use CommentConverter\Plugin\RestApi\RestApi;
use CommentConverter\Plugin\Utils\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Plugin.
 *
 * @since 0.9.1
 */
class Plugin {

	/**
	 * Holds a static instance of the class object.
	 *
	 * @since 0.9.1
	 *
	 * @var Plugin
	 */
	protected static $instance;

	/**
	 * Holds a static instance of the container.
	 *
	 * @since 0.9.1
	 *
	 * @var Container
	 */
	protected static $container;

	/**
	 * Plugin version, used for cache-busting of style and script file references.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	public $version = '0.9.1';

	/**
	 * The name of the plugin.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	public $plugin_name = 'Comment Converter';

	/**
	 * The assets base URL for this plugin.
	 *
	 * @var string
	 */
	public $url;

	/**
	 * Executes the plugin by setting up the hooks to make the plugin work.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function run() {
		// Initialize the plugin.
		add_action( 'init', array( $this, 'init' ) );

		// Hide the unrelated admin notices.
		add_action( 'admin_print_scripts', array( $this, 'hide_unrelated_admin_notices' ) );

		// Add CC's hosts to list of allowed redirect hosts.
		add_filter( 'allowed_redirect_hosts', array( $this, 'add_allowed_redirect_hosts' ) );
	}

	/**
	 * Initialize the plugin.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		$this->define_constants();

		$this->setup_container();

		// Options should initialize before Schema.
		static::$container->get( Options::class )->init();

		// Keep the database schema updated.
		static::$container->get( Schema::class )->init();

		static::$container->get( PostMeta::class )->init();

		static::$container->get( RestApi::class )->init();

		static::$container->get( Gutenberg::class )->init();

		static::$container->get( Bootstrap\Async\CommentNotification::class )->init();

		static::$container->get( Bootstrap\Async\NotificationDigest::class )->init();

		static::$container->get( Bootstrap\Backend\CommentHandler::class )->init();

		static::$container->get( Bootstrap\Backend\RewriteRules::class )->init();

		if ( is_admin() ) {
			static::$container->get( Bootstrap\Admin\Pages::class )->init();
			static::$container->get( Bootstrap\Admin\ClassicEditor::class )->init();
			static::$container->get( Bootstrap\Admin\ListTables::class )->init();
			static::$container->get( Bootstrap\Admin\Onboarding::class )->init();
		} else {
			static::$container->get( Bootstrap\Frontend\CommentForm::class )->init();
			static::$container->get( Bootstrap\Frontend\FollowingBadge::class )->init();
			static::$container->get( Bootstrap\Frontend\FollowerDashboardShortcode::class )->init();
			static::$container->get( Bootstrap\Frontend\FollowerDashboardPage::class )->init();
		}
	}

	/**
	 * Sets up the plugin's container.
	 *
	 * It defines which classes should be singleton and how to instantiate certain classes.
	 *
	 * The container has auto-wiring set up, so other classes are auto binded if they're not meant to be singletons
	 * or don't have any special constructor argument needs.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function setup_container() {
		static::$container = new Container();

		static::$container->singleton( Options::class );
		static::$container->singleton( Bootstrap\Admin\Pages::class );
	}

	/**
	 * Convenience method to get entries from the plugin's container.
	 *
	 * @since 0.9.1
	 *
	 * @param string $id The entry id.
	 *
	 * @throws Exceptions\Container\NotFoundException  No entry was found for **this** identifier.
	 * @throws Exceptions\Container\ContainerException Error while retrieving the entry.
	 *
	 * @return mixed The container entry.
	 */
	public static function get( $id ) {
		return static::$container->get( $id );
	}

	/**
	 * Set all the plugin-wide constants.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function define_constants() {
		$this->url = plugin_dir_url( COMMENT_CONVERTER_FILE );

		do_action( 'comment_converter_before_define_constants', $this );

		// Define necessary plugin constants.

		if ( ! defined( 'COMMENT_CONVERTER_MARKETING_URL' ) ) {
			define( 'COMMENT_CONVERTER_MARKETING_URL', 'https://commentconverter.com' );
		}

		if ( ! defined( 'COMMENT_CONVERTER_ENV' ) ) {
			define( 'COMMENT_CONVERTER_ENV', 'production' );
		}
	}

	/**
	 * Hides unrelated admin notices.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function hide_unrelated_admin_notices() {
		// Bail if we're not on a Comment Converter screen.
		if ( ! Utils::is_cc_page() ) {
			return;
		}

		global $wp_filter;

		$notices_type = array(
			'user_admin_notices',
			'admin_notices',
			'all_admin_notices',
		);

		foreach ( $notices_type as $type ) {
			if ( empty( $wp_filter[ $type ]->callbacks ) || ! is_array( $wp_filter[ $type ]->callbacks ) ) {
				continue;
			}

			foreach ( $wp_filter[ $type ]->callbacks as $priority => $hooks ) {
				foreach ( $hooks as $name => $arr ) {
					if ( is_object( $arr['function'] ) && $arr['function'] instanceof \Closure ) {
						unset( $wp_filter[ $type ]->callbacks[ $priority ][ $name ] );
						continue;
					}

					$class = ! empty( $arr['function'][0] ) && is_object( $arr['function'][0] ) ? strtolower( get_class( $arr['function'][0] ) ) : '';

					if ( ! empty( $class ) && preg_match( '/^(?:ccapi|cc_notification)/', $class ) ) {
						continue;
					}

					if ( ! empty( $name ) && ! preg_match( '/^(?:ccapi|cc_notification)/', $name ) ) {
						unset( $wp_filter[ $type ]->callbacks[ $priority ][ $name ] );
					}
				}
			}
		}
	}

	/**
	 * Add Comment Converter's hosts to the list of allowed redirect hosts.
	 *
	 * @since 0.9.1
	 *
	 * @param array $hosts An array of allowed host names.
	 *
	 * @return array The updated list of allowed redirect hosts.
	 */
	public function add_allowed_redirect_hosts( $hosts ) {
		$cc_hosts = array(
			'commentconverter.com',
		);

		return array_merge( $hosts, $cc_hosts );
	}

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @since 0.9.1
	 *
	 * @return Plugin
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Plugin ) ) {
			self::$instance = new Plugin();
		}

		return self::$instance;
	}
}
