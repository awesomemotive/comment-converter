<?php
/**
 * Comment Converter Settings.
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
 * Comment Converter Settings.
 *
 * @since 0.9.1
 */
class Settings {

	/**
	 * Holds the instance of Options.
	 *
	 * @since 0.9.1
	 *
	 * @var Options
	 */
	protected $options;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Options $options Instance of Options.
	 */
	public function __construct( Options $options ) {
		$this->options = $options;
	}

	/**
	 * Retrieves the default values for the settings.
	 *
	 * @since 0.9.1
	 *
	 * @return array The default values for the settings.
	 */
	public function get_default_values() {
		return array(
			'general'      => array(
				'enabled_post_types'           => array( 'post' ),
				'follower_dashboard_page_path' => '/follow-comments',
				'following_badge_path'         => 'colored-logo',
				'following_badge_color'        => '#FCB63E',
				'is_double_optin_enabled'      => true,
				'should_authors_auto_follow'   => false,
				'allow_only_logged_in_users'   => false,
				'display_powered_by_logo'      => true,
				'affiliate_url'                => '',
				'blocklisted_emails'           => array(),
			),

			'emails'       => array(
				'sender_name' => get_bloginfo( 'name' ),
				'from_email'  => get_bloginfo( 'admin_email' ),
				'reply_to'    => get_bloginfo( 'admin_email' ),
			),

			'comment_form' => array(
				'follower_dashboard_link_text'     => __( 'Manage Followed Comments', 'subscribe-to-comment-notifications-comment-converter' ),
				'notification_after_commenting'    => __( 'Would you like to be notified by email when someone replies to this comment?', 'subscribe-to-comment-notifications-comment-converter' ),
				'notification_after_following_single_opt_in' => __( 'Thank you for following this discussion.', 'subscribe-to-comment-notifications-comment-converter' ),
				'notification_after_following_double_opt_in' => __( 'Thank you for requesting to follow this discussion. To confirm your request, please click the confirmation link in the email we just sent to your inbox.', 'subscribe-to-comment-notifications-comment-converter' ),
				'notification_after_subscribing'   => __( 'Thank you for subscribing to our newsletter. Please check your email for your next steps.', 'subscribe-to-comment-notifications-comment-converter' ),
				'notification_after_following_and_subscribing_single_opt_in' => __( 'Thank you for following this discussion, and for joining our newsletter.', 'subscribe-to-comment-notifications-comment-converter' ),
				'notification_after_following_and_subscribing_double_opt_in' => __( 'Thank you for requesting to follow this discussion, and for joining our newsletter. To confirm your request, please click the confirmation link in the email we just sent to your inbox.', 'subscribe-to-comment-notifications-comment-converter' ),
				'notification_after_unsubscribing' => __( 'You are no longer following this comment/replies at [Post_Title].', 'subscribe-to-comment-notifications-comment-converter' ),
			),
		);
	}

	/**
	 * Retrieves the enabled content types.
	 *
	 * @since 0.9.1
	 *
	 * @return array The enabled content types.
	 */
	public function get_enabled_post_types() {
		return $this->get( 'general.enabled_post_types' );
	}

	/**
	 * Checks if the given post type is enabled.
	 *
	 * @since 0.9.1
	 *
	 * @param string $post_type The post type to check.
	 *
	 * @return bool Returns true if the post type is enabled, false otherwise.
	 */
	public function is_post_type_enabled( $post_type ) {
		return in_array( $post_type, $this->get_enabled_post_types(), true );
	}

	/**
	 * Retrieves the follower dashboard page path.
	 *
	 * @since 0.9.1
	 *
	 * @return string The follower dashboard page path.
	 */
	public function get_follower_dashboard_page_path() {
		return trim( $this->get( 'general.follower_dashboard_page_path' ), '/' );
	}

	/**
	 * Retrieves the follower dashboard url.
	 *
	 * @since 0.9.1
	 *
	 * @param string $path The path.
	 *
	 * @return string The follower dashboard url.
	 */
	public function get_follower_dashboard_url( $path = '' ) {
		$url = home_url( $this->get_follower_dashboard_page_path() );

		return ! empty( $path ) ? trailingslashit( $url ) . $path : $url;
	}

	/**
	 * Retrieves the following badge path.
	 *
	 * @since 0.9.1
	 *
	 * @return string The following badge path.
	 */
	public function get_following_badge_path() {
		return $this->get( 'general.following_badge_path' );
	}

	/**
	 * Retrieves the following badge color.
	 *
	 * @since 0.9.1
	 *
	 * @return string The following badge color.
	 */
	public function get_following_badge_color() {
		return $this->get( 'general.following_badge_color' );
	}

	/**
	 * Determines if double opt-in is enabled.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if double opt-in is enabled, false otherwise.
	 */
	public function is_double_optin_enabled() {
		return $this->get( 'general.is_double_optin_enabled' );
	}

	/**
	 * Determines if authors should follows automatically created for their own posts.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if authors should automatically follow their own posts, false otherwise.
	 */
	public function should_authors_auto_follow() {
		return $this->get( 'general.should_authors_auto_follow' );
	}

	/**
	 * Determines if only logged in users should be allowed to follow posts or comments.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if only logged in users should be allowed to follow posts or comments, false otherwise.
	 */
	public function should_allow_only_logged_in_users() {
		return $this->get( 'general.allow_only_logged_in_users' );
	}

	/**
	 * Determines if the "powered by" logo should be displayed.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the "powered by" logo should be displayed, false otherwise.
	 */
	public function should_display_powered_by_logo() {
		return $this->get( 'general.display_powered_by_logo' );
	}

	/**
	 * Retrieves the affiliate URL.
	 *
	 * @since 0.9.1
	 *
	 * @return string The affiliate URL.
	 */
	public function get_affiliate_url() {
		return $this->get( 'general.affiliate_url' );
	}

	/**
	 * Gets the list of blocklisted emails.
	 *
	 * @since 0.9.1
	 *
	 * @return array The list of blocklisted emails.
	 */
	public function get_blocklisted_emails() {
		return $this->get( 'general.blocklisted_emails' );
	}

	/**
	 * Returns the email sender name.
	 *
	 * @since 0.9.1
	 *
	 * @return string The email sender name.
	 */
	public function get_email_sender_name() {
		return $this->get( 'emails.sender_name' );
	}

	/**
	 * Returns the email from address.
	 *
	 * @since 0.9.1
	 *
	 * @return string The email from address.
	 */
	public function get_email_from() {
		return $this->get( 'emails.from_email' );
	}

	/**
	 * Returns the email reply-to address.
	 *
	 * @since 0.9.1
	 *
	 * @return string The email reply-to address.
	 */
	public function get_email_reply_to() {
		return $this->get( 'emails.reply_to' );
	}

	/**
	 * Retrieves the Follower Dashboard link text.
	 *
	 * @since 0.9.1
	 *
	 * @return string The the Follower Dashboard link text.
	 */
	public function get_comment_form_follower_dashboard_link_text() {
		return $this->get( 'comment_form.follower_dashboard_link_text' );
	}

	/**
	 * Retrieves the notification message after commenting.
	 *
	 * @since 0.9.1
	 *
	 * @return string The notification message after commenting.
	 */
	public function get_comment_form_notification_after_commenting() {
		return $this->get( 'comment_form.notification_after_commenting' );
	}

	/**
	 * Retrieves the notification message after following with single opt-in.
	 *
	 * @since 0.9.1
	 *
	 * @return string The notification message after following with single opt-in.
	 */
	public function get_comment_form_notification_after_following_single_opt_in() {
		return $this->get( 'comment_form.notification_after_following_single_opt_in' );
	}

	/**
	 * Retrieves the notification message after following with double opt-in.
	 *
	 * @since 0.9.1
	 *
	 * @return string The notification message after following with double opt-in.
	 */
	public function get_comment_form_notification_after_following_double_opt_in() {
		return $this->get( 'comment_form.notification_after_following_double_opt_in' );
	}

	/**
	 * Retrieves the notification message after subscribing.
	 *
	 * @since 0.9.1
	 *
	 * @return string The notification message after subscribing.
	 */
	public function get_comment_form_notification_after_subscribing() {
		return $this->get( 'comment_form.notification_after_subscribing' );
	}

	/**
	 * Retrieves the notification message after following and subscribing with single opt-in.
	 *
	 * @since 0.9.1
	 *
	 * @return string The notification message after following and subscribing with single opt-in.
	 */
	public function get_comment_form_notification_after_following_and_subscribing_single_opt_in() {
		return $this->get( 'comment_form.notification_after_following_and_subscribing_single_opt_in' );
	}

	/**
	 * Retrieves the notification message after following and subscribing with double opt-in.
	 *
	 * @since 0.9.1
	 *
	 * @return string The notification message after following and subscribing with double opt-in.
	 */
	public function get_comment_form_notification_after_following_and_subscribing_double_opt_in() {
		return $this->get( 'comment_form.notification_after_following_and_subscribing_double_opt_in' );
	}

	/**
	 * Retrieves the notification message after unsubscribing.
	 *
	 * @since 0.9.1
	 *
	 * @return string The notification message after unsubscribing.
	 */
	public function get_comment_form_notification_after_unsubscribing() {
		return $this->get( 'comment_form.notification_after_unsubscribing' );
	}

	/**
	 * Retrieves all settings, including general, emails, and comment form settings.
	 *
	 * @since 0.9.1
	 *
	 * @return array The array of all settings.
	 */
	public function get_all() {
		$defaults = $this->get_default_values();

		$general = $this->get( 'general', $defaults['general'] );
		$emails  = $this->get( 'emails', $defaults['emails'] );
		$form    = $this->get( 'comment_form', $defaults['comment_form'] );

		return array(
			'general'      => $general,
			'emails'       => $emails,
			'comment_form' => $form,
		);
	}

	/**
	 * Updates the settings with the provided data.
	 *
	 * @since 0.9.1
	 *
	 * @param array $data The new settings data.
	 *
	 * @return void
	 */
	public function update( $data ) {
		foreach ( $data as $key => $value ) {
			if ( ! in_array( $key, array( 'general', 'emails', 'comment_form' ), true ) ) {
				continue;
			}

			$this->options->set( $key, $value );
		}
	}

	/**
	 * Returns a settings value form the options.
	 *
	 * @since 0.9.1
	 *
	 * @param  string $key      The option value to get for given key.
	 * @param  mixed  $fallback The fallback value.
	 *
	 * @return mixed            The main option array for the plugin, or requsted value.
	 */
	protected function get( $key = '', $fallback = null ) {
		if ( empty( $fallback ) ) {
			$fallback = Arr::get( $this->get_default_values(), $key );
		}

		return $this->options->get( $key, $fallback );
	}
}
