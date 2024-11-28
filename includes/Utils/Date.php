<?php
/**
 * Comment Converter Date Utils.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Date Utils.
 *
 * @since 0.9.1
 */
class Date {

	/**
	 * Formats a date and time string.
	 *
	 * This method converts a date and time string to a Unix timestamp, then formats it according to the WordPress date and time settings.
	 *
	 * @since 0.9.1
	 *
	 * @param string $date_time_str The date and time string to format.
	 *
	 * @return string The formatted date and time string.
	 */
	public static function format_date_str( $date_time_str ) {
		// Convert the date and time string to a Unix timestamp.
		$timestamp = strtotime( $date_time_str );

		$date_format = get_option( 'date_format', 'F j, Y' );
		$time_format = get_option( 'time_format', 'g:i a' );

		return date_i18n( "{$date_format} {$time_format}", $timestamp );
	}
}
