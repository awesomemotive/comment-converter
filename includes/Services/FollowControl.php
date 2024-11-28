<?php
/**
 * Comment Converter Follow Control.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Services;

use CommentConverter\Plugin\Bootstrap\Frontend\CommentForm;
use CommentConverter\Plugin\Services\SystemControl;
use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Database\Models\Follow;
use CommentConverter\Plugin\Database\Repositories\FollowerRepository;
use CommentConverter\Plugin\Database\Repositories\FollowRepository;
use CommentConverter\Plugin\Emails\ConfirmationEmail;
use CommentConverter\Plugin\Plugin;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\VariableReplacer;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follow Control.
 *
 * @since 0.9.1
 */
class FollowControl {

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
	 * Holds the instance of FollowerRepository.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowerRepository
	 */
	protected $follower_repository;

	/**
	 * Holds the instance of FollowRepository.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowRepository
	 */
	protected $follow_repository;

	/**
	 * Holds the instance of EmailControl.
	 *
	 * @since 0.9.1
	 *
	 * @var EmailControl
	 */
	protected $email_control;

	/**
	 * Cache the list of follows per follower.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected $post_follows_by_follower = array();

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Settings           $settings Instance of Settings.
	 * @param SystemControl      $system_control Instance of SystemControl.
	 * @param FollowerRepository $follower_repository Instance of FollowerRepository.
	 * @param FollowRepository   $follow_repository Instance of FollowRepository.
	 * @param EmailControl       $email_control Instance of EmailControl.
	 */
	public function __construct( Settings $settings, SystemControl $system_control, FollowerRepository $follower_repository, FollowRepository $follow_repository, EmailControl $email_control ) {
		$this->settings            = $settings;
		$this->system_control      = $system_control;
		$this->follower_repository = $follower_repository;
		$this->follow_repository   = $follow_repository;
		$this->email_control       = $email_control;
	}

	/**
	 * Processes the follow and subscribe request for the specified comment.
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_Comment $comment The comment to process the follow request for.
	 * @param array       $follow_and_subscription_options The follow and subscribe options.
	 *
	 * @return array|null The new or exiting follow record, or NULL if no follow was created for some reason.
	 */
	public function process_follow_and_subscription( \WP_Comment $comment, array $follow_and_subscription_options ) {
		// There's no point in doing anything without an email address.
		if ( empty( $comment->comment_author_email ) ) {
			return;
		}

		$is_comment_following_enabled = $this->system_control->is_comment_following_enabled( $comment->comment_post_ID );

		$is_comment_subscribing_enabled = $this->system_control->is_comment_subscribing_enabled( $comment->comment_post_ID );

		$follow_type = $follow_and_subscription_options['follow'] ?? CommentForm::FOLLOW_OPTION_NO_FOLLOW;

		$chose_to_follow = CommentForm::FOLLOW_OPTION_NO_FOLLOW !== $follow_type;

		$chose_to_subscribe = ! empty( $follow_and_subscription_options['subscribe'] );

		if ( ( $chose_to_follow && $is_comment_following_enabled ) || ( $chose_to_subscribe && $is_comment_subscribing_enabled ) ) {
			return $this->add_follow_and_subscription(
				$comment->comment_author_email,
				$comment->comment_author,
				$comment->comment_post_ID,
				$comment->comment_ID,
				$follow_type,
				$chose_to_subscribe
			);
		}

		return null;
	}

	/**
	 * Adds a follow and/or subscription for a user.
	 *
	 * @since 0.9.1
	 *
	 * @param string $email The email of the user.
	 * @param string $name The name of the user.
	 * @param int    $post_id The ID of the post.
	 * @param int    $comment_id The ID of the comment.
	 * @param string $follow_type The type of follow.
	 * @param bool   $chose_to_subscribe Whether the user chose to subscribe.
	 * @param bool   $confirmed Whether the follow should be created as confirmed.
	 *
	 * @return array Returns an array with the follower, the follow and a flag indicating if a new follow was created.
	 */
	public function add_follow_and_subscription( $email, $name, $post_id, $comment_id, $follow_type, $chose_to_subscribe, $confirmed = false ) {
		// If double opt-in is not enabled, we'll consider the follower as confirmed.
		$confirmed = ( $confirmed || ! $this->settings->is_double_optin_enabled() );

		$user_id       = 0;
		$user_verified = $confirmed;
		if ( is_user_logged_in() ) {
			$current_user  = wp_get_current_user();
			$user_id       = $current_user->ID;
			$user_verified = true;
			$confirmed     = true;
		}

		$follower = $this->follower_repository->first_or_create( $email, $name, $user_verified, $user_id );

		$chose_to_follow = CommentForm::FOLLOW_OPTION_NO_FOLLOW !== $follow_type;

		$follow_created = false;
		$follow         = null;

		if ( $chose_to_follow ) {
			list( $follow_created, $follow ) = $this->add_follow( $follower, $post_id, $comment_id, $follow_type, $chose_to_subscribe, $confirmed );
		}

		if ( $chose_to_subscribe ) {
			$this->subscribe_follower( $follower );
		}

		if ( $follow_created ) {
			// The confirmation email should be sent regardless of the double opt-in setting.
			$this->send_confirmation_email( $follow );
		}

		return array(
			'follower' => $follower,
			'follow'   => $follow,
			'created'  => $follow_created,
		);
	}

	/**
	 * Retrieves a follow by its ID.
	 *
	 * @since 0.9.1
	 *
	 * @param int $follow_id The ID of the follow.
	 *
	 * @return Follow Returns the follow object.
	 */
	public function get_follow_by_id( $follow_id ) {
		return $this->follow_repository->get_by_id( $follow_id );
	}

	/**
	 * Confirms a follow.
	 *
	 * @since 0.9.1
	 *
	 * @param int $follow_id The ID of the follow.
	 */
	public function confirm_follow( $follow_id ) {
		$this->follow_repository->confirm( $follow_id );
	}

	/**
	 * Unsubscribes a follow.
	 *
	 * Unsubscribing a follow should delete the follow.
	 *
	 * @since 0.9.1
	 *
	 * @param int $follow_id The ID of the follow.
	 */
	public function unsubscribe_follow( $follow_id ) {
		$this->follow_repository->delete( $follow_id );
	}

	/**
	 * Checks if a user is following a post.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower|array|string $follower The follower. It could an email address, and array containing the email address or a Follower object.
	 * @param int                   $post_id The ID of the post.
	 *
	 * @return bool Returns true if the user is following the post, false otherwise.
	 */
	public function is_user_following_post( $follower, $post_id ) {
		$follows = $this->get_followers_post_follows( $follower, $post_id );

		$follows_for_post = array_values(
			array_filter(
				$follows,
				function( $follow ) {
					return $follow->is_following_all_comments() && $follow->is_active();
				}
			)
		);

		return 0 < count( $follows_for_post ) ? $follows_for_post[0] : false;
	}

	/**
	 * Checks if a user is following a comment.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower|array|string $follower The follower. It could an email address, and array containing the email address or a Follower object.
	 * @param int                   $post_id The ID of the post.
	 * @param int                   $comment_id The ID of the comment.
	 *
	 * @return bool Returns true if the user is following the comment, false otherwise.
	 */
	public function is_user_following_comment( $follower, $post_id, $comment_id ) {
		$follows = $this->get_followers_post_follows( $follower, $post_id );

		$follows_for_comment = array_values(
			array_filter(
				$follows,
				function( $follow ) use ( $comment_id ) {
					return $follow->is_following_comment( $comment_id ) && $follow->is_active();
				}
			)
		);

		return 0 < count( $follows_for_comment ) ? $follows_for_comment[0] : false;
	}

	/**
	 * Checks if a user has subscribed to a post.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower|array|string $follower The follower. It could an email address, and array containing the email address or a Follower object.
	 * @param int                   $post_id The ID of the post.
	 *
	 * @return bool Returns true if the user has subscribed to the post, false otherwise.
	 */
	public function has_user_subscribed_to_post( $follower, $post_id ) {
		$follows = $this->get_followers_post_follows( $follower, $post_id );

		$subscribes_for_post = array_values(
			array_filter(
				$follows,
				function( $follow ) {
					return $follow->has_subscribed() && $follow->is_active();
				}
			)
		);

		return 0 < count( $subscribes_for_post ) ? $subscribes_for_post[0] : false;
	}

	/**
	 * Gets the follows of a follower for a post.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower|array|string $follower The follower. It could an email address, and array containing the email address or a Follower object.
	 * @param int                   $post_id The ID of the post.
	 *
	 * @return array Returns an array of follows.
	 */
	public function get_followers_post_follows( $follower, $post_id ) {
		if ( is_string( $follower ) ) {
			$follower = $this->follower_repository->get_by_email( $follower );
		} elseif ( is_array( $follower ) && ! empty( $follower['email'] ) ) {
			$follower = $this->follower_repository->get_by_email( $follower['email'] );
		}

		// If not an existing follower, return an empty array.
		if ( empty( $follower ) || ! $follower instanceof Follower ) {
			return array();
		}

		if ( isset( $this->post_follows_by_follower[ $follower->id ][ $post_id ] ) ) {
			return $this->post_follows_by_follower[ $follower->id ][ $post_id ];
		}

		if ( ! empty( $this->post_follows_by_follower[ $follower->id ] ) ) {
			$this->post_follows_by_follower[ $follower->id ] = array();
		}

		$post_follows = $this->follow_repository->get_by_follower_post( $follower->id, $post_id );

		$this->post_follows_by_follower[ $follower->id ][ $post_id ] = $post_follows;

		return $this->post_follows_by_follower[ $follower->id ][ $post_id ];
	}

	/**
	 * Adds a new follow for the specified follower and comment.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower $follower The follower to add the follow for.
	 * @param int      $post_id The comment to add the follow for.
	 * @param int      $comment_id The comment to add the follow for.
	 * @param string   $follow_type The type of follow to add.
	 * @param bool     $chose_to_subscribe Whether the follower chose to subscribe to the comment thread.
	 * @param bool     $confirmed Whether the follow record is confirmed.
	 *
	 * @return Follow The new follow record, or the existing one if the follower is already following the whole post.
	 */
	protected function add_follow( Follower $follower, $post_id, $comment_id, string $follow_type, bool $chose_to_subscribe, bool $confirmed ) {
		$follow_for_post = $this->is_user_following_post( $follower, $post_id );

		if ( $follow_for_post ) {
			// If it's already following the whole post, no need to add a new follow.
			return array( false, $follow_for_post );
		}

		$new_follow = $this->follow_repository->add(
			$follower->id,
			$post_id,
			$comment_id,
			$follow_type,
			$chose_to_subscribe,
			$confirmed,
		);

		return array( true, $new_follow );
	}

	/**
	 * Sends a confirmation email to the follower.
	 *
	 * @since 0.9.1
	 *
	 * @param Follow $follow The follow object.
	 *
	 * @return void
	 */
	protected function send_confirmation_email( Follow $follow ) {
		$type = $this->settings->is_double_optin_enabled() ? ConfirmationEmail::TYPE_DOUBLE_OPT_IN : ConfirmationEmail::TYPE_SINGLE_OPT_IN;

		$email = new ConfirmationEmail( $this, $this->settings, $follow, $type, Plugin::get( VariableReplacer::class ) );
		$this->email_control->send( $email );
	}

	/**
	 * Subscribes the specified follower to the email list.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower $follower The follower to subscribe to the email list.
	 *
	 * @return void
	 */
	protected function subscribe_follower( Follower $follower ) {
		// Check if account is PRO.
		// Use API to subscribe follower.
		// Only sets the subscriber flag after we have confirmed the subscription.

		// TODO: implement subscription and only update the follower after we confirmed the subscription.
		$this->follower_repository->set_subscriber( $follower );
	}
}
