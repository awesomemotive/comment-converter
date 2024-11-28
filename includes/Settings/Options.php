<?php
/**
 * Comment Converter Options.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Settings;

use CommentConverter\Plugin\Utils\Arr;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Options.
 *
 * @since 0.9.1
 */
class Options {

	/**
	 * Holds the name for the Comment Converter main option record.
	 *
	 * @since 0.9.1
	 */
	const OPTION_NAME = 'comment_converter_options';

	/**
	 * Sets our options if not found in the DB.
	 *
	 * @since 0.9.1
	 */
	public function init() {

		// Check/set the plugin options.
		$option = get_option( static::OPTION_NAME );
		if ( empty( $option ) ) {
			$option = $this->default_options();
			update_option( static::OPTION_NAME, $option );
		}
	}

	/**
	 * Loads the default plugin options.
	 *
	 * @since 0.9.1
	 *
	 * @return array Array of default plugin options.
	 */
	public function default_options() {

		$options = array(
			'current_level'  => 'lite',
			'installed'      => time(),
			'uninstall_data' => true,
		);

		return apply_filters( 'comment_converter_default_options', $options );
	}

	/**
	 * Return the level of the CC user.
	 *
	 * @since 0.9.1
	 *
	 * @return string The level.
	 */
	public function get_level() {
		return $this->get( 'current_level' );
	}

	/**
	 * Returns the installed database version.
	 *
	 * @since 0.9.1
	 *
	 * @return string The installed database version.
	 */
	public function get_db_version() {
		return $this->get( 'db_version' );
	}

	/**
	 * Returns the installed database version.
	 *
	 * @since 0.9.1
	 *
	 * @param string $db_version The installed database version.
	 *
	 * @return string The installed database version.
	 */
	public function set_db_version( $db_version ) {
		$this->set( 'db_version', $db_version );
		return $this;
	}

	/**
	 * Returns an option value.
	 *
	 * @since 0.9.1
	 *
	 * @param  string $key      The option value to get for given key.
	 * @param  mixed  $fallback The fallback value.
	 *
	 * @return mixed            The main option array for the plugin, or requsted value.
	 */
	public function get( $key = '', $fallback = null ) {
		$option = get_option( static::OPTION_NAME );

		return Arr::get( $option, $key, $fallback );
	}

	/**
	 * Sets the value of the specified option key.
	 *
	 * @since 0.9.1
	 *
	 * @param string $key The option key to set.
	 * @param mixed  $value The value to set for the option key.
	 *
	 * @return Options The Options instance.
	 */
	public function set( $key = '', $value = '' ) {
		$option = get_option( static::OPTION_NAME );

		// We use the returned value as opposed to the passed value as reference, because
		// passing values by reference does not work with Facades.
		$option = Arr::set( $option, $key, $value );

		update_option( static::OPTION_NAME, $option );

		return $this;
	}
}
