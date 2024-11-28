<?php
/**
 * Comment Converter Utils.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Utils.
 *
 * @since 0.9.1
 */
class Utils {

	/**
	 * Returns a URL for the given path relative to the plugin directory.
	 *
	 * @since 0.9.1
	 *
	 * @param string $path Path relative to the plugin directory.
	 *
	 * @return string URL for the given path relative to the plugin directory.
	 */
	public static function dir_url( $path = '' ) {
		return plugin_dir_url( COMMENT_CONVERTER_FILE ) . $path;
	}

	/**
	 * Returns a path for the given path relative to the plugin directory.
	 *
	 * @since 0.9.1
	 *
	 * @param string $path Path relative to the plugin directory.
	 *
	 * @return string Path for the given path relative to the plugin directory.
	 */
	public static function dir_path( $path ) {
		return plugin_dir_path( COMMENT_CONVERTER_FILE ) . $path;
	}

	/**
	 * Checks if given (or current) page is an Comment Converter admin page.
	 *
	 * @since 0.9.1
	 *
	 * @param string $page Page to check. Falls back to $_REQUEST['page'].
	 *
	 * @return boolean Whether given (or current) page is an Comment Converter admin page.
	 */
	public static function is_cc_page( $page = null ) {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended -- Nonce not required.
		if ( empty( $page ) && ! empty( $_REQUEST['page'] ) ) {
			$page = sanitize_key( wp_unslash( $_REQUEST['page'] ) );
		}
		// phpcs:enable WordPress.Security.NonceVerification.Recommended

		return ! empty( $page ) && preg_match( '/comment-converter-/', $page );
	}

	/**
	 * The access capability required for access to Comment Converter pages/settings.
	 *
	 * @since  1.0.0
	 *
	 * @param  string|null $slug The menu slug. Null by default.
	 *
	 * @return string The access capability.
	 */
	public static function access_capability( $slug = null ) {
		return apply_filters( 'comment_converter_access_cap', 'manage_options', $slug );
	}

	/**
	 * Check if user has access capability required for access to Comment Converter pages/settings.
	 *
	 * @since  1.0.0
	 *
	 * @param  string|null $slug The menu slug. Null by default.
	 *
	 * @return bool Whether user has access.
	 */
	public static function can_access( $slug = null ) {
		return current_user_can( self::access_capability( $slug ) );
	}

	/**
	 * Sets a cookie.
	 *
	 * @since 0.9.1
	 *
	 * @param string $name The name of the cookie.
	 * @param string $value The value of the cookie.
	 * @param int    $expire The time the cookie expires.
	 */
	public static function set_cookie( $name, $value, $expire = 0 ) {

		// Get WordPress cookie settings.
		$secure        = is_ssl();
		$cookiepath    = COOKIEPATH; // Consider using SITECOOKIEPATH in case we want to support multiple sites on the same domain.
		$cookie_domain = COOKIE_DOMAIN;

		setcookie( $name, $value, $expire, $cookiepath, $cookie_domain, $secure, true );
	}

	/**
	 * Unsets a cookie.
	 *
	 * @since 0.9.1
	 *
	 * @param string $name The name of the cookie.
	 */
	public static function unset_cookie( $name ) {
		static::set_cookie( $name, '', time() - HOUR_IN_SECONDS );
	}

	/**
	 * Initialize the WordPress file system
	 *
	 * @since 0.9.1
	 *
	 * @global WP_Filesystem_Base $wp_filesystem
	 */
	public static function init_filesystem() {
		global $wp_filesystem;

		if ( ! empty( $wp_filesystem ) ) {
			return;
		}

		// Include the file-system.
		require_once ABSPATH . 'wp-admin/includes/file.php';

		// Initialize the file system.
		WP_Filesystem();
	}

	/**
	 * Retrieves the contents of a file.
	 *
	 * This function uses the WordPress Filesystem API to read the contents of a file.
	 * It first ensures that the WP_Filesystem is loaded, then uses its get_contents method to read the file.
	 *
	 * @since 0.9.1
	 *
	 * @param string $file_path The path to the file to read.
	 *
	 * @return string|false The function returns the read data or false on failure.
	 *
	 * @global WP_Filesystem_Base $wp_filesystem
	 */
	public static function get_contents( string $file_path ) {
		global $wp_filesystem;

		// Make sure WP_Filesystem is loaded.
		self::init_filesystem();

		// Get the file contents.
		return $wp_filesystem->get_contents( $file_path );
	}

	/**
	 * Gets the rendered HTML of the specified file, relative to the plugin root directory.
	 *
	 * @since 0.9.1
	 *
	 * @param string $file_path The path to the file.
	 * @param array  $data      An array of items to make available to the template.
	 *
	 * @return string The HTML. An empty string on failure.
	 */
	public static function get_html( string $file_path = '', array $data = array() ) {
		// If no file path was passed, return an empty string.
		if ( empty( $file_path ) ) {
			return '';
		}

		// Get the full directory path.
		$full_path = self::dir_path( $file_path );

		// If the file doesn't exist on disk, return an empty string.
		if ( ! file_exists( $full_path ) ) {
			return '';
		}

		// Use output buffering to get the rendered HTML.
		ob_start();
		require $full_path;
		$output = ob_get_clean();

		return $output;
	}

	/**
	 * Gets the rendered HTML of the specified email template.
	 *
	 * @since 0.9.1
	 *
	 * @param WP_Comment[] $comments The array of `WP_Comment` objects.
	 *
	 * @return string The email HTML.
	 */
	public static function get_email_html( array $comments ) {
		// Get the logo binary data.
		$logo = self::get_contents( self::dir_path( 'assets/logos/comment-converter-primary-logo.png' ) );

		// Create the data array for use in the email template.
		$data = array(
			'footer_logo' => base64_encode( $logo ),
			'comments'    => $comments,
		);

		return self::get_html( '/views/emails/comment-following-notification-message.php', $data );
	}
}
