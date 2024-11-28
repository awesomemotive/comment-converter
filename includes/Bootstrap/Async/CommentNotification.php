<?php
/**
 * Comment Converter Comment Notification.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Async;

use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Database\Repositories\FollowRepository;
use CommentConverter\Plugin\Emails\NotificationEmail;
use CommentConverter\Plugin\Services\EmailControl;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\VariableReplacer;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Comment Notification.
 *
 * @since 0.9.1
 */
class CommentNotification {

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Holds the instance of Options.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowRepository
	 */
	protected $follow_repository;

	/**
	 * Holds the instance of VariableReplacer.
	 *
	 * @since 0.9.1
	 *
	 * @var VariableReplacer
	 */
	protected $variable_replacer;

	/**
	 * Holds the instance of EmailControl.
	 *
	 * @since 0.9.1
	 *
	 * @var EmailControl
	 */
	protected $email_control;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1

	 * @param Settings         $settings Instance of Settings.
	 * @param FollowRepository $follow_repository Instance of FollowRepository.
	 * @param VariableReplacer $variable_replacer Instance of VariableReplacer.
	 * @param EmailControl     $email_control Instance of EmailControl.
	 */
	public function __construct( Settings $settings, FollowRepository $follow_repository, VariableReplacer $variable_replacer, EmailControl $email_control ) {
		$this->settings          = $settings;
		$this->follow_repository = $follow_repository;
		$this->variable_replacer = $variable_replacer;
		$this->email_control     = $email_control;
	}

	/**
	 * Sets up the hooks for sending comment notifications.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'ccvtr_send_new_comment_notifications', array( $this, 'notification_delivery_loop' ) );
	}

	/**
	 * Handles the delivery loop for sending notifications to followers.
	 *
	 * @since 0.9.1
	 *
	 * @param int $comment_id The comment id.
	 *
	 * @return void
	 */
	public function notification_delivery_loop( int $comment_id = 0 ) {

		// If no comment id was passed, do nothing.
		if ( empty( $comment_id ) ) {
			return;
		}

		// Get the comment object.
		$comment = get_comment( $comment_id );

		// If no comment is found for the comment id, do nothing.
		if ( empty( $comment ) ) {
			return;
		}

		// List all followers from the comment's post. This comment should trigger notifications for
		// the followers following all comments from that post and for the followers following the
		// parent comment.
		$follows = $this->follow_repository->get_by_post( $comment->comment_post_ID, array( 'follower' ) );

		$follows = array_filter(
			$follows,
			function( $follow ) use ( $comment ) {

				// Filter out follows from the commenter to prevent sending the notification to the commenter
				// considering it could had been following the all the comments from the post.
				if ( $follow->follower->notification_email === $comment->comment_author_email ) {
					return false;
				}

				// Filter out inactive follows.
				if ( ! $follow->is_active() ) {
					return false;
				}

				return true;
			}
		);

		if ( empty( $follows ) ) {
			return;
		}

		$post_follows  = array();
		$reply_follows = array();

		foreach ( $follows as $follow ) {

			// Check if it's a follow for all comments in the post. Don't add the same follower twice.
			if ( $follow->is_following_all_comments() && empty( $post_follows[ $follow->follower->id ] ) ) {
				$post_follows[ $follow->follower->id ] = $follow;

				// Otherwise, check if it's a follow for a reply in the parent comment. Don't add the same follower twice.
			} elseif ( $follow->comment_id === $comment->comment_parent && empty( $reply_follows[ $follow->follower->id ] ) ) {
				$reply_follows[ $follow->follower->id ] = $follow;
			}
		}

		foreach ( array_keys( $post_follows ) as $follower_id ) {
			if ( ! empty( $reply_follows[ $follower_id ] ) ) {

				// If the follower is following the post and the parent comment, remove the parent
				// comment follow to prevent the follower from being notified twice.
				unset( $reply_follows[ $follower_id ] );
			}
		}

		if ( empty( $post_follows ) && empty( $reply_follows ) ) {
			return;
		}

		$notification_email = new NotificationEmail( $this->settings, array( $comment ), $this->variable_replacer );

		if ( ! empty( $reply_follows ) ) {
			foreach ( array_values( $reply_follows ) as $reply_follow ) {
				if ( $this->can_send_notification( $reply_follow->follower ) ) {
					$this->email_control->send( $notification_email->set_notifiee( $reply_follow->follower ) );
				}
			}
		}

		if ( ! empty( $post_follows ) ) {
			foreach ( array_values( $post_follows ) as $post_follow ) {
				if ( $this->can_send_notification( $post_follow->follower ) ) {
					$this->email_control->send( $notification_email->set_notifiee( $post_follow->follower ) );
				}
			}
		}
	}

	/**
	 * Checks if a notification can be sent to a follower.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower $follower The follower object.
	 *
	 * @return bool Whether the notification can be sent.
	 */
	protected function can_send_notification( Follower $follower ) {
		if ( $this->settings->is_double_optin_enabled() && ! $follower->is_verified() ) {
			return false;
		}

		if ( 'immediately' !== $follower->notification_frequency ) {
			return false;
		}

		return true;
	}
}
