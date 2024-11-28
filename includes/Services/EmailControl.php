<?php
/**
 * Comment Converter Email Control.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Services;

use CommentConverter\Plugin\Emails\BaseEmail;
use CommentConverter\Plugin\Settings\Settings;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Email Control.
 *
 * @since 0.9.1
 */
class EmailControl {

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
	 * Sends the email.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True on success, false on failure.
	 */
	public function send( BaseEmail $email ) {
		if ( in_array( $email->get_recipient_email(), $this->settings->get_blocklisted_emails(), true ) ) {
			return false;
		}

		// Set the default headers.
		$headers  = 'Content-Type: text/html; charset=' . get_bloginfo( 'charset' ) . "\n";
		$headers .= "From: \"{$email->get_sender()}\" <{$email->get_email_from()}>\n";
		$headers .= "Reply-To: {$email->get_reply_to()}\n";

		// Add the extra headers.
		$headers .= $email->get_extra_headers();

		$message = $this->wrap_html_message( $email->get_message(), $email->get_subject() );

		$ret = wp_mail( $email->get_recipient_email(), esc_html( $email->get_subject() ), $message, $headers );

		return $ret;
	}

	/**
	 * Wraps the email message in HTML.
	 *
	 * @since 0.9.1
	 *
	 * @param string $message The email message.
	 * @param string $subject The email subject.
	 *
	 * @return string The wrapped email message.
	 */
	public function wrap_html_message( $message = '', $subject = '' ) {
		global $wp_locale;

		$html = '<html>';

		if ( 'rtl' === $wp_locale->text_direction ) {
			$locale = get_locale();
			$html   = "<html xmlns='http://www.w3.org/1999/xhtml' dir='rtl' lang='" . esc_attr( $locale ) . "'>";
		}

		$head = '<head><title>' . esc_html( $subject ) . '</title></head>';
		$body = '<body>' . $message . '</body>';

		return $html . $head . $body . '</html>';
	}
}
