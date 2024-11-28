<?php
/**
 * Comment Converter Notification Email.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Emails;

use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\Utils;
use CommentConverter\Plugin\Utils\VariableReplacer;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Notification Email.
 *
 * @since 0.9.1
 */
class NotificationEmail extends BaseEmail {

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Holds the instance of WP_Post.
	 *
	 * @since 0.9.1
	 *
	 * @var \WP_Post
	 */
	protected $post;

	/**
	 * Holds the instance of WP_Comment.
	 *
	 * @since 0.9.1
	 *
	 * @var \WP_Comment[]
	 */
	protected $comments;

	/**
	 * Holds the instance of Follower.
	 *
	 * @since 0.9.1
	 *
	 * @var Follower
	 */
	protected $follower;

	/**
	 * Holds the instance of VariableReplacer.
	 *
	 * @since 0.9.1
	 *
	 * @var VariableReplacer
	 */
	protected $variable_replacer;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Settings         $settings Instance of settings.
	 * @param \WP_Comment[]    $comments The instance of the comment the notification is about.
	 * @param VariableReplacer $variable_replacer Instance of settings.
	 *
	 * @return void
	 */
	public function __construct( Settings $settings, array $comments, VariableReplacer $variable_replacer ) {
		$this->settings          = $settings;
		$this->comments          = $comments;
		$this->variable_replacer = $variable_replacer;

		$this->set_sender( $this->settings->get_email_sender_name() );
		$this->set_email_from( $this->settings->get_email_from() );
		$this->set_reply_to( $this->settings->get_email_reply_to() );

		$this->build_subject();
		$this->build_message();
	}

	/**
	 * Builds the subject for the email.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function build_subject() {
		$site_title = get_bloginfo( 'name' );

		if ( empty( $site_title ) ) {
			$site_domain = home_url();

			$parsed_url = wp_parse_url( $site_domain );
			$site_title = $parsed_url['host'];
		}

		// translators: %s is the site title or domain.
		$subject = sprintf( __( 'Comment Digest from %s', 'comment-notifications' ), $site_title );

		if ( 1 === count( $this->comments ) ) {
			$subject = __( 'New Comment: ', 'comment-notifications' ) . get_the_title( $this->comments[0]->comment_post_ID );
		}

		$this->set_subject( $subject );
	}

	/**
	 * Builds the message for the email.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function build_message() {
		$this->message = Utils::get_email_html( $this->comments );
	}

	/**
	 * Sets the notifiee for the email.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower $follower The follower that will be notified.
	 *
	 * @return NotificationEmail The current instance of the class.
	 */
	public function set_notifiee( Follower $follower ) {
		$this->follower = $follower;

		$this->variable_replacer->set_follower( $follower );

		// Resets the message to the original so we can replace the variables again.
		$this->build_message();

		// Replace the variables that are specific to the follower.
		$this->message = $this->variable_replacer->replace( $this->message );

		$this->set_recipient( $follower->name, $follower->notification_email );

		return $this;
	}

	/**
	 * Sends the email.
	 *
	 * @inheritDoc
	 */
	public function send() {
		if ( 1 === count( $this->comments ) ) {
			$this->extra_headers  = "X-Post-Id: {$this->comments[0]->comment_post_ID}\n";
			$this->extra_headers .= "X-Comment-Id: {$this->comments[0]->comment_ID}\n";
		}

		return parent::send();
	}
}
