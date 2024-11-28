<?php
/**
 * Comment Converter Comment Form.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Frontend;

use CommentConverter\Plugin\Services\FollowControl;
use CommentConverter\Plugin\Services\FollowerControl;
use CommentConverter\Plugin\Services\SystemControl;
use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Comment Form.
 *
 * @since 0.9.1
 */
class CommentForm {

	const FOLLOW_OPTION_COMMENT_REPLIES = 'replies';
	const FOLLOW_OPTION_ALL_COMMENTS    = 'all';
	const FOLLOW_OPTION_NO_FOLLOW       = 'no';
	const SUBSCRIBE_OPTION_YES          = 'yes';

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Holds the instance of SystemControl.
	 *
	 * @since 0.9.1
	 *
	 * @var SystemControl
	 */
	protected $system_control;

	/**
	 * Holds the instance of FollowControl.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowControl
	 */
	protected $follow_control;

	/**
	 * Holds the instance of FollowerControl.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowerControl
	 */
	protected $follower_control;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Settings        $settings Instance of Settings.
	 * @param SystemControl   $system_control Instance of SystemControl.
	 * @param FollowControl   $follow_control Instance of FollowControl.
	 * @param FollowerControl $follower_control Instance of FollowerControl.
	 */
	public function __construct( Settings $settings, SystemControl $system_control, FollowControl $follow_control, FollowerControl $follower_control ) {
		$this->settings         = $settings;
		$this->system_control   = $system_control;
		$this->follow_control   = $follow_control;
		$this->follower_control = $follower_control;
	}

	/**
	 * Sets up the hooks for the comment form.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		// The `comment_form_default_fields` filter is used to add the Comment Converter fields to the comment form
		// when user is not logged in. And the `comment_form_field_comment` filter is used to add the Comment Converter
		// fields to the comment form when user is logged in. And that's because when the user is logged in, the default
		// behavior is for WP to only output the comments field. So we use the `comment_form_field_comment` filter to
		// force the output the Comment Converter fields after the comments field. When using the `comment_form_default_fields`
		// filter, we're able to position the CC fields after the cookies fields, which is where we intend to place them.
		add_filter( 'comment_form_default_fields', array( $this, 'add_comment_following_fields' ) );
		add_filter( 'comment_form_field_comment', array( $this, 'output_comment_following_fields' ) );
	}

	/**
	 * Adds Comment Converter fields to the comment form when not logged in.
	 *
	 * Hook: comment_form_default_fields
	 *
	 * @see https://developer.wordpress.org/reference/hooks/comment_form_default_fields/
	 *
	 * @since 0.9.1
	 *
	 * @param array $fields Array of the default comment fields.
	 *
	 * @return array The modified comment form fields.
	 */
	public function add_comment_following_fields( $fields ) {
		$post_id = get_the_ID();

		if ( empty( $post_id ) ) {
			return $fields;
		}

		if ( ! $this->system_control->is_comment_converter_enabled( $post_id ) ) {
			return $fields;
		}

		// If the user is logged in, we use the `comment_form_field_comment` filter to output the fields.
		if ( is_user_logged_in() ) {
			return $fields;
		}

		$can_follow_comment_on_post = $this->can_follow_comment_on_post( $post_id );
		$can_subscribe_on_post      = $this->can_subscribe_on_post( $post_id );

		if ( ! $can_follow_comment_on_post && ! $can_subscribe_on_post ) {
			return $fields;
		}

		// The Comment Converter fields must be added after the cookies fields. In order to do that,
		// we need to remove the fields after the cookies field and add them back after the Comment
		// Converter fields.
		$fields_past_cookies = array();
		foreach ( $fields as $key => $field ) {
			// Collect and remove the cookies fields and any other fields past it.
			if ( 'cookies' === $key || ! empty( $fields_past_cookies ) ) {
				$fields_past_cookies[ $key ] = $field;
				unset( $fields[ $key ] );
			}
		}

		if ( $can_follow_comment_on_post ) {
			$fields['ccvtr-follow'] = $this->get_comment_following_field();
		}

		if ( $can_subscribe_on_post ) {
			$fields['ccvtr-subscribe'] = $this->get_comment_subscribe_field();
		}

		// Add a nonce field for the Comment Converter form.
		$fields['ccvtr-nonce'] = $this->get_nonce_field();

		// Restore the cookies fields and the other fields past it.
		foreach ( $fields_past_cookies as $key => $field ) {
			$fields[ $key ] = $field;
		}

		$asset_file = include Utils::dir_path( 'build/comment-form.asset.php' );
		wp_enqueue_style( 'ccvtr-comment-form-style', Utils::dir_url( 'build/comment-form.css' ), array(), $asset_file['version'] );

		return $fields;
	}

	/**
	 * Adds Comment Converter fields to the comment form when logged in.
	 *
	 * Hook: comment_form_field_comment
	 *
	 * @see https://developer.wordpress.org/reference/hooks/comment_form_field_comment/
	 *
	 * @since 0.9.1
	 *
	 * @param string $comment_textarea_field The comment field.
	 *
	 * @return string The modified comment field.
	 */
	public function output_comment_following_fields( $comment_textarea_field ) {
		if ( ! is_user_logged_in() ) {
			return $comment_textarea_field;
		}

		$post_id = get_the_ID();

		if ( empty( $post_id ) ) {
			return $comment_textarea_field;
		}

		if ( ! $this->system_control->is_comment_converter_enabled( $post_id ) ) {
			return $comment_textarea_field;
		}

		$can_follow_comment_on_post = $this->can_follow_comment_on_post( $post_id );
		$can_subscribe_on_post      = $this->can_subscribe_on_post( $post_id );

		if ( ! $can_follow_comment_on_post && ! $can_subscribe_on_post ) {
			return $comment_textarea_field;
		}

		if ( $can_follow_comment_on_post ) {
			$comment_textarea_field .= $this->get_comment_following_field();
		}

		if ( $can_subscribe_on_post ) {
			$comment_textarea_field .= $this->get_comment_subscribe_field();
		}

		$comment_textarea_field .= $this->get_nonce_field();

		return $comment_textarea_field;
	}

	/**
	 * Determines if a user can follow comments on a post.
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Returns true if the user can follow comments, false otherwise.
	 */
	protected function can_follow_comment_on_post( $post_id ) {
		$comment_following_enabled = $this->system_control->is_comment_following_enabled( $post_id );

		if ( ! $comment_following_enabled ) {
			return false;
		}

		$current_follower = $this->follower_control->get_current_follower();

		if ( empty( $current_follower ) ) {
			return true;
		}

		// No reason to follow a comment if user is already following the whole post.
		return ! $this->follow_control->is_user_following_post( $current_follower, $post_id );
	}

	/**
	 * Determines if a user can subscribe to a post.
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Returns true if the user can subscribe, false otherwise.
	 */
	protected function can_subscribe_on_post( $post_id ) {
		return false;

		/*
		COMMENTED UNTIL PRO

		$comment_subscribing_enabled = $this->system_control->is_comment_subscribing_enabled( $post_id );

		if ( ! $comment_subscribing_enabled ) {
			return false;
		}

		$current_follower = $this->follower_control->get_current_follower();

		if ( empty( $current_follower ) ) {
			return true;
		}

		return ! $this->follow_control->has_user_subscribed_to_post( $current_follower, $post_id );
		*/
	}

	/**
	 * Generates the HTML for the Comment Converter comment following field.
	 *
	 * @since 0.9.1
	 *
	 * @return string The HTML for the Comment Converter comment following field.
	 */
	protected function get_comment_following_field() {
		$current_follower = $this->follower_control->get_current_follower();

		$default_follow_option = self::FOLLOW_OPTION_COMMENT_REPLIES;
		if ( ! empty( $current_follower ) && $current_follower instanceof Follower ) {
			$default_follow_option = $current_follower->default_follow_type;
		}

		$options = array(
			self::FOLLOW_OPTION_COMMENT_REPLIES => esc_html__( 'Follow replies to my comment', 'comment-notifications' ),
			self::FOLLOW_OPTION_ALL_COMMENTS    => esc_html__( 'Follow all comments and replies by email', 'comment-notifications' ),
			self::FOLLOW_OPTION_NO_FOLLOW       => esc_html__( 'Do not follow comments or replies', 'comment-notifications' ),
		);

		$select_options = '';
		foreach ( $options as $value => $label ) {
			$selected        = $value === $default_follow_option ? 'selected="selected"' : '';
			$select_options .= '<option value="' . esc_attr( $value ) . '" ' . $selected . '>' . esc_html( $label ) . '</option>';
		}

		return '<p class="comment-form-ccvtr-follow">
			<label for="ccvtr-follow"> ' . esc_html__( 'Follow Comments', 'comment-notifications' ) . ' </label>
			<select id="ccvtr-follow" name="ccvtr-follow">' . $select_options . '</select>
		</p>';
	}

	/**
	 * Generates the HTML for the Comment Converter subscribe field.
	 *
	 * @since 0.9.1
	 *
	 * @return string The HTML for the Comment Converter subscribe field.
	 */
	protected function get_comment_subscribe_field() {
		// We also add the `comment-form-cookies-consent` class, which is the class used by WP Core, so our
		// checkbox field can automatically inherit the styles meant for the WP Core consent checkbox.
		// This should help with theme compatibility.
		return '<p class="comment-form-ccvtr-subscribe comment-form-cookies-consent">
			<input id="ccvtr-subscribe" name="ccvtr-subscribe" type="checkbox" value="' . self::SUBSCRIBE_OPTION_YES . '" />
			<label for="ccvtr-subscribe">' . esc_html__( 'Subscribe to our newsletter', 'comment-notifications' ) . '</label>
		</p>';
	}

	/**
	 * Generates the HTML for the Comment Converter nonce field.
	 *
	 * @since 0.9.1
	 *
	 * @return string The HTML for the Comment Converter nonce field.
	 */
	protected function get_nonce_field() {
		return wp_nonce_field( 'cctr_comment_form', 'cctr_comment_form_nonce', true, false );
	}

	/**
	 * Returns an array of valid comment follow options.
	 *
	 * @since 0.9.1
	 *
	 * @return array An array of valid comment follow options.
	 */
	public static function get_valid_follow_options() {
		return array(
			self::FOLLOW_OPTION_COMMENT_REPLIES,
			self::FOLLOW_OPTION_ALL_COMMENTS,
			self::FOLLOW_OPTION_NO_FOLLOW,
		);
	}
}
