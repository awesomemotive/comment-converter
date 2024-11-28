<?php
/**
 * Comment Converter
 *
 * @package CommentConverter
 * @author  Comment Converter Team
 *
 * @wordpress-plugin
 * Plugin Name: Comment Notifications
 * Plugin URI:  https://commentconverter.com
 * Description: The simplest, most effective WordPress comment notifications plugin, enabling visitors to subscribe to comment replies and your email list in just one click.
 * Author:      Comment Converter Team
 * Version:     1.0.0
 * Text Domain: comment-notifications
 * Domain Path: languages
 * License: GPLv2 or later
 *
 * Requires at least:    6.2
 * Tested up to:         6.7
 * Requires PHP:         7.4
 *
 * Comment Notifications is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * Comment Notifications is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Comment Notifications. If not, see <https://www.gnu.org/licenses/>.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'COMMENT_CONVERTER_FILE' ) ) {
	define( 'COMMENT_CONVERTER_FILE', __FILE__ );
}

if ( ! defined( 'COMMENT_CONVERTER_DIR' ) ) {
	define( 'COMMENT_CONVERTER_DIR', plugin_dir_path( COMMENT_CONVERTER_FILE ) );
}

use CommentConverter\Plugin\Bootstrap\Admin\Onboarding;
use CommentConverter\Plugin\Bootstrap\Async\NotificationDigest;

/**
 * Comment Converter plugin loader.
 *
 * @since 0.9.1
 */
class CommentConverterLoader {

	/**
	 * Holds a static instance of the class object.
	 *
	 * @since 0.9.1
	 *
	 * @var Loader
	 */
	protected static $instance;

	/**
	 * Array with requirements that were not met.
	 *
	 * Possible values:
	 *  - wp: for when the WP minimum version requirement is not met.
	 *  - php: for when the PHP minimum version requirement is not met.
	 *
	 * @var array
	 */
	protected $failed_requirements = array();

	/**
	 * Comment Converter's loader class constructor.
	 *
	 * @since 0.9.1
	 */
	public function __construct() {
		register_activation_hook( COMMENT_CONVERTER_FILE, array( $this, 'on_activation' ) );
		register_deactivation_hook( COMMENT_CONVERTER_FILE, array( $this, 'on_deactivation' ) );

		// Load the plugin textdomain.
		add_action( 'plugins_loaded', array( $this, 'load_plugin_textdomain' ) );
	}

	/**
	 * Fired when the plugin is activated.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function on_activation() {
		if ( ! $this->meet_requirements() ) {
			deactivate_plugins( plugin_basename( COMMENT_CONVERTER_FILE ) );

			if ( in_array( 'wp', $this->failed_requirements, true ) ) {
				/* translators: %1$s - WordPress Admin URL. And Comment Converter is the name of the plugin. */
				wp_die( wp_kses_post( sprintf( __( 'Sorry, but your version of WordPress does not meet Comment Converter\'s required version of <strong>6.0</strong> to run properly. The plugin has been deactivated. <a href="%1$s">Click here to return to the Dashboard</a>.', 'comment-notifications' ), esc_url( admin_url() ) ) ) );
			}

			if ( in_array( 'php', $this->failed_requirements, true ) ) {
				/* translators: %1$s - WordPress Admin URL. And Comment Converter is the name of the plugin. */
				wp_die( wp_kses_post( sprintf( __( 'Sorry, but the version of PHP that you site is running does not meet Comment Converter\'s required version of <strong>7.4</strong> to run properly. The plugin has been deactivated. <a href="%1$s">Click here to return to the Dashboard</a>.', 'comment-notifications' ), esc_url( admin_url() ) ) ) );
			}
		}

		// TODO: Figure out how to make this work with `flush_rewrite_rules`.
		update_option( 'rewrite_rules', '' );

		// Add transient to trigger redirect to the getting started screen.
		set_transient( Onboarding::TRANSIENT_KEY, true, 30 );

		// Add the cron job to send the notification digests.
		NotificationDigest::register_cron();
	}

	/**
	 * Fired when the plugin is deactivated.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function on_deactivation() {
		// Remove all scheduled actions related to the plugin.
		if ( class_exists( 'ActionScheduler_DBStore' ) ) {
			\ActionScheduler_DBStore::instance()->cancel_actions_by_group( 'comment_converter' );
		}

		// TODO: Figure out how to make this work with `flush_rewrite_rules`.
		update_option( 'rewrite_rules', '' );

		// Remove schedule cron hooks.
		wp_clear_scheduled_hook( 'ccvtr_notification_digest_cron_daily' );
		wp_clear_scheduled_hook( 'ccvtr_notification_digest_cron_weekly' );
	}

	/**
	 * Loads the plugin textdomain for translation.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function load_plugin_textdomain() {
		$domain = 'comment-notifications';

		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
		$locale = apply_filters( 'plugin_locale', get_locale(), $domain );

		load_textdomain( $domain, WP_LANG_DIR . '/' . $domain . '/' . $domain . '-' . $locale . '.mo' );
		load_plugin_textdomain( $domain, false, dirname( plugin_basename( COMMENT_CONVERTER_FILE ) ) . '/languages/' );
	}

	/**
	 * Checks if the plugin's requirement are being met.
	 *
	 * @since 0.9.1
	 *
	 * @global string $wp_version The version of WordPress for this install.
	 *
	 * @return bool Whether the plugin's requirements are being met.
	 */
	public function meet_requirements() {
		global $wp_version;

		// Reset the failed requirements.
		$this->failed_requirements = array();

		if ( ! version_compare( $wp_version, '6.0', '>=' ) ) {
			$this->failed_requirements[] = 'wp';
		}

		if ( ! version_compare( PHP_VERSION, '7.4', '>=' ) ) {
			$this->failed_requirements[] = 'php';
		}

		return empty( $this->failed_requirements );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function load() {
		if ( $this->meet_requirements() ) {
			// Action Scheduler requires a special loading procedure.
			require_once COMMENT_CONVERTER_DIR . 'vendor/woocommerce/action-scheduler/action-scheduler.php';

			// Autoload Composer packages.
			require_once COMMENT_CONVERTER_DIR . 'vendor/autoload.php';

			$plugin = \CommentConverter\Plugin\Plugin::get_instance();
			$plugin->run();
		} else {
			add_action( 'admin_notices', array( $this, 'requirements_notice' ) );
		}
	}

	/**
	 * Outputs the requirements notice.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function requirements_notice() {
		if ( in_array( 'wp', $this->failed_requirements, true ) ) {
			?>
			<div class="notice notice-error">
				<p>
					<?php
						/* translators: Comment Converter is the name of the plugin. */
						echo wp_kses_post( __( 'Sorry, but your version of WordPress does not meet Comment Converter\'s required version of <strong>6.0</strong> to run properly.', 'comment-notifications' ) );
					?>
				</p>
			</div>
			<?php
		}

		if ( in_array( 'php', $this->failed_requirements, true ) ) {
			?>
			<div class="notice notice-error">
				<p>
					<?php
						/* translators: Comment Converter is the name of the plugin. */
						echo wp_kses_post( __( 'Sorry, but the version of PHP that you site is running does not meet Comment Converter\'s required version of <strong>7.4</strong> to run properly.', 'comment-notifications' ) );
					?>
				</p>
			</div>
			<?php
		}
	}

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @since 0.9.1
	 *
	 * @return CommentConverterLoader
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof CommentConverterLoader ) ) {
			self::$instance = new CommentConverterLoader();
		}

		return self::$instance;
	}
}

// Load the plugin.
CommentConverterLoader::get_instance()->load();
