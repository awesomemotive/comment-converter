<?php
/**
 * Comment Converter Base Email.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Emails;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Base Email.
 *
 * @since 0.9.1
 */
abstract class BaseEmail {

	/**
	 * The email subject.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected $subject;

	/**
	 * The email message.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected $message;

	/**
	 * The email recipient's email address.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected $recipient_email;

	/**
	 * The email recipient's name.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected $recipient_name;

	/**
	 * The email sender's name.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected $sender;

	/**
	 * The email from address.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected $email_from;

	/**
	 * The email reply-to address.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected $reply_to;

	/**
	 * Extra headers to include in the email.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected $extra_headers;

	/**
	 * Gets the email subject.
	 *
	 * @since 0.9.1
	 *
	 * @return string The email subject.
	 */
	public function get_subject() {
		return $this->subject;
	}

	/**
	 * Sets the email subject.
	 *
	 * @since 0.9.1
	 *
	 * @param string $subject The email subject.
	 */
	public function set_subject( $subject ) {
		$this->subject = $subject;
	}

	/**
	 * Gets the email message.
	 *
	 * @since 0.9.1
	 *
	 * @return string The email message.
	 */
	public function get_message() {
		return $this->message;
	}

	/**
	 * Sets the email message.
	 *
	 * @since 0.9.1
	 *
	 * @param string $message The email message.
	 */
	public function set_message( $message ) {
		$this->message = $message;
	}

	/**
	 * Gets the email recipient's name.
	 *
	 * @since 0.9.1
	 *
	 * @return string The recipient's name.
	 */
	public function get_recipient_name() {
		return $this->recipient_name;
	}

	/**
	 * Gets the email recipient's email address.
	 *
	 * @since 0.9.1
	 *
	 * @return string The recipient's email address.
	 */
	public function get_recipient_email() {
		return $this->recipient_email;
	}

	/**
	 * Sets the email recipient's name and email address.
	 *
	 * @since 0.9.1
	 *
	 * @param string $name          The recipient's name.
	 * @param string $email_address The recipient's email address.
	 */
	public function set_recipient( $name, $email_address ) {
		$this->recipient_name  = $name;
		$this->recipient_email = $email_address;
	}

	/**
	 * Gets the email sender's name.
	 *
	 * @since 0.9.1
	 *
	 * @return string The sender's name.
	 */
	public function get_sender() {
		return $this->sender;
	}

	/**
	 * Sets the email sender's name and email address.
	 *
	 * @since 0.9.1
	 *
	 * @param string $sender The sender's name and email address.
	 */
	public function set_sender( $sender ) {
		$this->sender = $sender;
	}

	/**
	 * Gets the email from address.
	 *
	 * @since 0.9.1
	 *
	 * @return string The email from address.
	 */
	public function get_email_from() {
		return $this->email_from;
	}

	/**
	 * Sets the email from address.
	 *
	 * @since 0.9.1
	 *
	 * @param string $email_from The email from address.
	 */
	public function set_email_from( $email_from ) {
		$this->email_from = $email_from;
	}

	/**
	 * Gets the email reply-to address.
	 *
	 * @since 0.9.1
	 *
	 * @return string The email reply-to address.
	 */
	public function get_reply_to() {
		return $this->reply_to;
	}

	/**
	 * Sets the email reply-to address.
	 *
	 * @since 0.9.1
	 *
	 * @param string $reply_to The email reply-to address.
	 */
	public function set_reply_to( $reply_to ) {
		$this->reply_to = $reply_to;
	}

	/**
	 * Gets the email extra headers.
	 *
	 * @since 0.9.1
	 *
	 * @return string The email extra headers.
	 */
	public function get_extra_headers() {
		return $this->extra_headers;
	}
}
