<?php
/**
 * Comment Converter Confirmation Email.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Emails;

use CommentConverter\Plugin\Services\FollowControl;
use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Database\Models\Follow;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\Utils;
use CommentConverter\Plugin\Utils\VariableReplacer;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Confirmation Email.
 *
 * @since 0.9.1
 */
class ConfirmationEmail extends BaseEmail {

	const TYPE_SINGLE_OPT_IN = 'single-opt-in';
	const TYPE_DOUBLE_OPT_IN = 'double-opt-in';

	/**
	 * Holds the instance of FollowControl.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowControl
	 */
	protected $follow_control;

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Holds the instance of Follow.
	 *
	 * @since 0.9.1
	 *
	 * @var Follow
	 */
	protected $follow;

	/**
	 * Holds the instance of Follower.
	 *
	 * @since 0.9.1
	 *
	 * @var Follower
	 */
	protected $follower;

	/**
	 * Holds the instance of WP_Post.
	 *
	 * @since 0.9.1
	 *
	 * @var \WP_Post
	 */
	protected $post;

	/**
	 * Holds the instance of VariableReplacer.
	 *
	 * @since 0.9.1
	 *
	 * @var VariableReplacer
	 */
	protected $variable_replacer;

	/**
	 * Holds the type of confirmation email.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected $type;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param FollowControl    $follow_control Instance of settings.
	 * @param Settings         $settings Instance of settings.
	 * @param Follow           $follow The follower record to confirm.
	 * @param string           $type The follower record to confirm.
	 * @param VariableReplacer $variable_replacer Instance of VariableReplacer.
	 *
	 * @return void
	 */
	public function __construct( FollowControl $follow_control, Settings $settings, Follow $follow, string $type, VariableReplacer $variable_replacer ) {
		$this->follow_control    = $follow_control;
		$this->settings          = $settings;
		$this->follow            = $follow;
		$this->post              = $follow->post;
		$this->follower          = $follow->follower;
		$this->type              = $type;
		$this->variable_replacer = $variable_replacer;
		$this->variable_replacer->set_follow( $follow )
			->set_post( $follow->post )
			->set_follower( $follow->follower );

		$this->set_sender( $this->settings->get_email_sender_name() );
		$this->set_email_from( $this->settings->get_email_from() );
		$this->set_reply_to( $this->settings->get_email_reply_to() );
		$this->set_recipient( $this->follower->name, $this->follower->notification_email );

		$this->build_subject();
		$this->build_mesage();
	}

	/**
	 * Builds the subject for the email.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function build_subject() {
		if ( self::TYPE_SINGLE_OPT_IN === $this->type ) {
			$subject = __( 'You\'re Now Following The Conversation At [Post_Title]', 'subscribe-to-comment-notifications-comment-converter' );
		} else {
			$subject = __( 'Confirmation required to follow comments: [Post_Title]', 'subscribe-to-comment-notifications-comment-converter' );
		}

		$this->set_subject( $this->variable_replacer->replace( $subject ) );
	}

	/**
	 * Builds the message for the email.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function build_mesage() {
		$double_opt_in = self::TYPE_DOUBLE_OPT_IN === $this->type;

		// Get the logo binary data.
		$logo = Utils::get_contents( Utils::dir_path( 'assets/logos/comment-converter-primary-logo.png' ) );

		$message = Utils::get_html(
			'/views/emails/follow-confirmation-message.php',
			array(
				'footer_logo'   => base64_encode( $logo ),
				'double_opt_in' => $double_opt_in,
			)
		);

		$this->message = $this->variable_replacer->replace( $message );
	}
}
