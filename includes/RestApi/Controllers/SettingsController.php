<?php
/**
 * Comment Converter Settings Controller.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\RestApi\Controllers;

use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Emails\NotificationEmail;
use CommentConverter\Plugin\Plugin;
use CommentConverter\Plugin\Exceptions\RestApi\InvalidParamException;
use CommentConverter\Plugin\Exceptions\RestApi\RestApiException;
use CommentConverter\Plugin\Services\EmailControl;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\Utils;
use CommentConverter\Plugin\Utils\VariableReplacer;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Settings Controller.
 *
 * @since 0.9.1
 */
class SettingsController extends BaseController {

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings The instance of Settings.
	 */
	protected Settings $settings;

	/**
	 * Holds the instance of EmailControl.
	 *
	 * @since 0.9.1
	 *
	 * @var EmailControl
	 */
	protected $email_control;

	/**
	 * Constructs a new SettingsController object.
	 *
	 * @since 0.9.1
	 *
	 * @param Settings     $settings The instance of Settings.
	 * @param EmailControl $email_control The instance of EmailControl.
	 */
	public function __construct( Settings $settings, EmailControl $email_control ) {
		$this->settings      = $settings;
		$this->email_control = $email_control;
	}

	/**
	 * Retrieves all the settings data.
	 *
	 * Route: GET /v1/settings
	 *
	 * @since 0.9.1
	 *
	 * @return \WP_REST_Response The REST API response.
	 */
	public function get() {
		$data = $this->settings->get_all();

		$data['emails'] = array_merge(
			$data['emails'],
			array(
				'email_preview' => $this->build_or_send_email_preview(),
			)
		);

		return new \WP_REST_Response( $data, 200 );
	}

	/**
	 * Updates the settings data.
	 *
	 * Route: POST /v1/settings
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 *
	 * @throws InvalidParamException If a request parameter value is invalid.
	 */
	public function update( \WP_REST_Request $request ) {
		try {
			$updated_data = $this->get_json_params(
				$request,
				array(
					'general'      => array(
						'enabled_post_types'           => 'required|array',
						'follower_dashboard_page_path' => 'required|string',
						'following_badge_path'         => 'required|string',
						'following_badge_color'        => 'required|string',
						'is_double_optin_enabled'      => 'bool',
						'should_authors_auto_follow'   => 'bool',
						'allow_only_logged_in_users'   => 'bool',
						'display_powered_by_logo'      => 'bool',
						'affiliate_url'                => 'string',
						'blocklisted_emails'           => 'array',
					),

					'emails'       => array(
						'sender_name' => 'required|string',
						'from_email'  => 'required|email',
						'reply_to'    => 'required|email',
					),

					'comment_form' => array(
						'follower_dashboard_link_text'     => 'required|string',
						'notification_after_commenting'    => 'required|string',
						'notification_after_following_single_opt_in' => 'required|string',
						'notification_after_following_double_opt_in' => 'required|string',
						'notification_after_subscribing'   => 'required|string',
						'notification_after_following_and_subscribing_single_opt_in' => 'required|string',
						'notification_after_following_and_subscribing_double_opt_in' => 'required|string',
						'notification_after_unsubscribing' => 'required|string',
					),
				)
			);
		} catch ( InvalidParamException $e ) {
			// Replace message with more generic and frontend friendly.
			return ( new InvalidParamException( __( 'The settings could not be saved due to invalid values.', 'subscribe-to-comment-notifications-comment-converter' ) ) )
				->set_extra_error( $e->getMessage() )
				->to_response();
		} catch ( RestApiException $e ) {
			return $e->to_response();
		}

		$old_follower_dashboard_page_path = $this->settings->get_follower_dashboard_page_path();

		$this->settings->update( $updated_data );

		$new_follower_dashboard_page_path = $this->settings->get_follower_dashboard_page_path();

		if ( $old_follower_dashboard_page_path !== $new_follower_dashboard_page_path ) {
			// If the follower dashboard page path has changed, we need to flush the rewrite rules.
			// TODO: Figure out how to make this work with `flush_rewrite_rules`.
			update_option( 'rewrite_rules', '' );
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
			),
			200
		);
	}

	/**
	 * Returns the email HTML to use for the settings page, or sends a test email
	 * from the settings page.
	 *
	 * Creates a dummy post and comments for to use as output on the "Notifications"
	 * settings page.
	 *
	 * @since 0.9.1
	 *
	 * @param string $get_or_send Whether to return the email HTML or send a test email.
	 * @param string $to          The email address to send the test email to.
	 *
	 * @return string|bool
	 */
	protected function build_or_send_email_preview( $get_or_send = 'get', $to = null ) {
		// Create a dummy comment object.
		$comment                  = new \WP_Comment( new \stdClass() );
		$comment->comment_ID      = 1234567890;
		$comment->comment_post_ID = null;
		$comment->comment_author  = 'Comment Author\'s Name';
		$comment->comment_content = 'This is an example comment that would appear inside the email for the follower to read and decide to take action on.';

		// Create a dummy post object, and stuff it into the global.
		$old_post            = $GLOBALS['post'] ?? null;
		$post                = new \WP_Post( new \stdClass() );
		$post->ID            = 1234567890;
		$post->post_title    = 'Example Post Title';
		$post->post_name     = 'example-post-title';
		$post->filter        = 'raw';
		$post->post_date     = '2024-05-01 00:00:00';
		$post->post_date_gmt = '2024-05-01 00:00:00';

		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		$GLOBALS['post'] = $post;

		if ( 'get' === $get_or_send ) {
			$output = Utils::get_email_html( array( $comment, $comment ) );
		} else {
			$variable_replacer = Plugin::get_instance()->get( VariableReplacer::class );
			$email             = new NotificationEmail( $this->settings, array( $comment, $comment ), $variable_replacer );
			$follower          = ( new Follower() )->fill(
				array(
					'name'               => wp_get_current_user()->display_name,
					'notification_email' => $to,
					'salt'               => time(),
					'unique_key'         => 'qwerty12345',
				)
			);
			$output            = $this->email_control->send( $email->set_notifiee( $follower ) );
		}

		// Reset the global post object.
		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		$GLOBALS['post'] = $old_post;

		return $output;
	}

	/**
	 * Sends a test email to the specified email address.
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 *
	 * @throws InvalidParamException If a request parameter value is invalid.
	 */
	public function send_test_email( \WP_REST_Request $request ) {
		try {
			$to = $this->get_param( $request, 'to', 'email' );

			if ( empty( $to ) ) {
				throw new InvalidParamException( __( 'A valid "to" parameter is required.', 'subscribe-to-comment-notifications-comment-converter' ) );
			}
		} catch ( RestApiException $e ) {
			return $e->to_response();
		}

		$success = $this->build_or_send_email_preview( 'send', $to );

		if ( ! $success ) {
			return new \WP_REST_Response( array( 'error' => __( 'The test email could not be sent.', 'subscribe-to-comment-notifications-comment-converter', ) ), 400 );
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
			),
			200
		);
	}
}
