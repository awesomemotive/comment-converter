<?php
/**
 * Comment Converter Comment Handler.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Backend;

use CommentConverter\Plugin\Bootstrap\Frontend\CommentForm;
use CommentConverter\Plugin\Services\FollowControl;
use CommentConverter\Plugin\Services\FollowerControl;
use CommentConverter\Plugin\Services\SystemControl;
use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Database\Repositories\FollowerRepository;
use CommentConverter\Plugin\Database\Repositories\FollowRepository;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\Utils;
use CommentConverter\Plugin\Utils\VariableReplacer;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Comment Handler.
 *
 * @since 0.9.1
 */
class CommentHandler {

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
	 * @var FollowerRepository
	 */
	protected $follower_repository;

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
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param SystemControl      $system_control Instance of SystemControl.
	 * @param FollowControl      $follow_control Instance of FollowControl.
	 * @param FollowerControl    $follower_control Instance of FollowerControl.
	 * @param Settings           $settings Instance of Settings.
	 * @param FollowerRepository $follower_repository Instance of FollowerRepository.
	 * @param FollowRepository   $follow_repository Instance of FollowRepository.
	 * @param VariableReplacer   $variable_replacer Instance of VariableReplacer.
	 */
	public function __construct( SystemControl $system_control, FollowControl $follow_control, FollowerControl $follower_control, Settings $settings, FollowerRepository $follower_repository, FollowRepository $follow_repository, VariableReplacer $variable_replacer ) {
		$this->system_control      = $system_control;
		$this->follow_control      = $follow_control;
		$this->follower_control    = $follower_control;
		$this->settings            = $settings;
		$this->follower_repository = $follower_repository;
		$this->follow_repository   = $follow_repository;
		$this->variable_replacer   = $variable_replacer;
	}

	/**
	 * Sets up the hooks for comment and post creation/update/delete.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'comment_post', array( $this, 'new_comment_posted' ), 12, 2 );

		add_action( 'wp_set_comment_status', array( $this, 'comment_status_changed' ), 10, 2 );

		add_action( 'deleted_comment', array( $this, 'comment_deleted' ) );

		// Maybe auto add a follow for the post author anytime a post is published.
		foreach ( $this->settings->get_enabled_post_types() as $post_type ) {
			// Ref.: https://developer.wordpress.org/reference/hooks/new_status_post-post_type/.
			add_action( 'publish_' . $post_type, array( $this, 'maybe_auto_follow_for_author' ), 10, 2 );
		}

		add_action( 'delete_post', array( $this, 'post_deleted' ) );

		add_action( 'comment_form', array( $this, 'maybe_enqueue_follow_confirmation' ), 10, 2 );
	}

	/**
	 * Handles the new comment posted event.
	 *
	 * Fires immediately after a comment is inserted into the database.
	 *
	 * Hook: comment_post
	 *
	 * @see https://developer.wordpress.org/reference/hooks/comment_post/
	 *
	 * @since 0.9.1
	 *
	 * @param int        $comment_id   The ID of the comment that was posted.
	 * @param int|string $comment_approved The approval status of the comment.
	 *                                     1 if the comment is approved, 0 if not, 'spam' if spam.
	 *
	 * @return void
	 */
	public function new_comment_posted( int $comment_id, $comment_approved ) {
		// If marked as spam, do nothing.
		if ( 'spam' === $comment_approved ) {
			return;
		}

		if ( 1 === $comment_approved ) {
			// If approved, send notifications to followers.
			as_enqueue_async_action( 'ccvtr_send_new_comment_notifications', array( 'comment_id' => (int) $comment_id ), 'comment_converter' );
		}

		$comment = get_comment( $comment_id );

		// There's no point in doing anything without an email address.
		if ( empty( $comment->comment_author_email ) ) {
			return;
		}

		if ( ! $this->system_control->is_comment_converter_enabled( $comment->comment_post_ID ) ) {
			return;
		}

		if ( empty( $_POST['cctr_comment_form_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['cctr_comment_form_nonce'] ) ), 'cctr_comment_form' ) ) {
			return;
		}

		// Sanitize the follow option.
		$follow_option = sanitize_text_field( wp_unslash( $_POST['ccvtr-follow'] ?? '' ) );

		// Validate the follow option.
		$follow_option = in_array( $follow_option, CommentForm::get_valid_follow_options(), true ) ? $follow_option : CommentForm::FOLLOW_OPTION_NO_FOLLOW;

		// Sanitize the subscribe option.
		$subscribe_option = sanitize_text_field( wp_unslash( $_POST['ccvtr-subscribe'] ?? '' ) );

		// Validate the subscribe option.
		$subscribe_option = ! empty( $subscribe_option ) && CommentForm::SUBSCRIBE_OPTION_YES === $subscribe_option;

		$follow_and_subscription_options = array(
			'follow'    => $follow_option,
			'subscribe' => $subscribe_option,
		);

		// Process the comment creation for followers and followings.
		$this->follow_control->process_follow_and_subscription( $comment, $follow_and_subscription_options );

		// Prepare the follow confirmation message. We output the confirmation message on the frontend when the follow is created.
		// Or we prompt the user asking them agian if they really don't want to follow the comment if they first had opted out.
		$this->prepare_follow_confirmation( $comment_id );
	}

	/**
	 * Prepares the follow confirmation message for a given comment.
	 *
	 * This function adds a hash of the comment ID to the comment's redirect URL,
	 * which signals the enqueueing of the confirmation message frontend script.
	 * It also sets a transient that associates the comment hash with the comment ID.
	 *
	 * @since 0.9.1
	 *
	 * @param int $comment_id The ID of the comment to prepare the follow confirmation for.
	 */
	protected function prepare_follow_confirmation( $comment_id ) {
		$comment_hash = wp_hash( $comment_id );

		// Add comment hash to the comment's redirect URL to signal the enqueueing of the confirmation message frontend script.
		add_filter(
			'comment_post_redirect',
			function( $location, $redirect_comment ) use ( $comment_hash, $comment_id ) {
				if ( (int) $redirect_comment->comment_ID !== (int) $comment_id ) {
					return $location;
				}

				$location = add_query_arg( 'ccvch', $comment_hash, $location );
				$location = add_query_arg( 'ccvnc', wp_create_nonce( 'follow-confirmation-nonce' ), $location );

				return $location;
			},
			10,
			2
		);

		// Set a transient that associates the comment hash with the comment ID.
		// 10 minutes is also the same duration an unapproved comment will stay visible to its author.
		set_transient( "ccvtr_comment_recently_posted_{$comment_hash}", $comment_id, 10 * MINUTE_IN_SECONDS );
	}

	/**
	 * Checks if the follow confirmation assets need to be enqueued and does so if necessary.
	 *
	 * This function checks if the comment hash is present in the URL and if so, it checks if the comment
	 * was recently posted. If so, it enqueues the follow confirmation frontend script.
	 *
	 *  @since 0.9.1
	 */
	public function maybe_enqueue_follow_confirmation() {
		if ( empty( $_GET['ccvnc'] ) ) {
			return;
		}

		$nonce = sanitize_text_field( wp_unslash( $_GET['ccvnc'] ) );

		// Verify the nonce. If it's not valid, return.
		if ( ! wp_verify_nonce( $nonce, 'follow-confirmation-nonce' ) ) {
			return;
		}

		// The comment hash is what signals the need for enqueueing the confirmation message frontend script.
		if ( empty( $_GET['ccvch'] ) ) {
			return;
		}

		$comment_hash = sanitize_text_field( wp_unslash( $_GET['ccvch'] ) );

		$comment_id = get_transient( "ccvtr_comment_recently_posted_{$comment_hash}" );

		if ( empty( $comment_id ) ) {
			return;
		}

		$follow = null;

		// The comment from $comment_id is one that was just posted. We need to look if there's any follow
		// associated with it. If so, we output the confirmation message. Otherwise, we prompt the user again
		// asking if they really don't want to follow the comment if they first had opted out.
		$comment_follows = $this->follow_repository->get_by_comment( $comment_id );

		if ( ! empty( $comment_follows ) ) {
			$comment_follows = array_filter(
				$comment_follows,
				function( $follow ) {
					return $follow->is_following();
				}
			);

			if ( ! empty( $comment_follows ) ) {
				$follow = array_shift( $comment_follows );
			}
		}

		$comment = get_comment( $comment_id );
		$post    = get_post( $comment->comment_post_ID );

		$js_data = array(
			'commentId' => $comment_id,
		);

		$is_following = ! empty( $follow ) && ! $follow->is_no_follow();
		if ( $this->system_control->is_comment_converter_enabled( $comment->comment_post_ID ) && ! $is_following ) {
			$js_data['promptToFollowAgain'] = true;

			// Without the nonce, the follow will not be created.
			$js_data['nonce'] = wp_create_nonce( 'ccvtr-follow-confirmation-' . $comment_id );
		}

		if ( $this->settings->is_double_optin_enabled() ) {
			$message = $this->settings->get_comment_form_notification_after_following_double_opt_in();
		} else {
			$message = $this->settings->get_comment_form_notification_after_following_single_opt_in();
		}

		$follower = $this->follower_control->get_current_follower();
		if ( ! empty( $follower ) ) {
			if ( $follower instanceof Follower ) {
				$message .= sprintf(
					'&nbsp;<a href="%s">%s</a>',
					esc_url( $this->settings->get_follower_dashboard_url() ),
					esc_html( $this->settings->get_comment_form_follower_dashboard_link_text() )
				);
			}
		}

		$this->variable_replacer->set_post( $post );

		$js_data['confirmationMessage'] = $this->variable_replacer->replace( $message );
		$js_data['promptMessage']       = $this->variable_replacer->replace( $this->settings->get_comment_form_notification_after_commenting() );

		$this->enqueue_follow_confirmation( $js_data );
	}

	/**
	 * Enqueues the follow confirmation scripts and styles.
	 *
	 * This function enqueues a CSS file for the confirmation messages and a JavaScript file that handles the confirmation logic.
	 * It also localizes the JavaScript file with data that it needs to work correctly.
	 *
	 * @since 0.9.1
	 *
	 * @param array $js_data The data to pass to the JavaScript file.
	 */
	protected function enqueue_follow_confirmation( $js_data ) {
		$asset_file = include Utils::dir_path( 'build/frontend/confirmation.asset.php' );
		wp_enqueue_style( 'ccvtr-confirmation-messages-style', Utils::dir_url( 'build/frontend/style-confirmation.css' ), array(), $asset_file['version'] );
		wp_register_script( 'ccvtr-confirmation-messages-script', Utils::dir_url( 'build/frontend/confirmation.js' ), $asset_file['dependencies'], $asset_file['version'], true );
		wp_localize_script( 'ccvtr-confirmation-messages-script', 'ccData', $js_data );
		wp_set_script_translations( 'ccvtr-confirmation-messages-script', 'comment-notifications', Utils::dir_path( 'languages' ) );
		wp_enqueue_script( 'ccvtr-confirmation-messages-script' );
	}

	/**
	 * Handles the comment status changed event.
	 *
	 * Fires immediately after transitioning a comment's status from one to another in the database
	 * and removing the comment from the object cache, but prior to all status transition hooks.
	 *
	 * Hook: wp_set_comment_status
	 *
	 * @see https://developer.wordpress.org/reference/hooks/wp_set_comment_status/
	 *
	 * @since 0.9.1
	 *
	 * @param string $comment_id     Comment ID as a numeric string.
	 * @param string $comment_status Current comment status. Possible values include
	 *                               'hold', '0', 'approve', '1', 'spam', and 'trash'.
	 */
	public function comment_status_changed( string $comment_id, string $comment_status ) {
		switch ( $comment_status ) {
			case '1':
			case 'approve':
				// Now that the comment has been approved, we can send the notifications to the followers.
				as_enqueue_async_action( 'ccvtr_send_new_comment_notifications', array( 'comment_id' => (int) $comment_id ), 'comment_converter' );
				break;
			case '0':
			case 'hold':
			case 'spam':
			case 'trash':
				// If the comment is not approved, no need to send notifications.
				break;
			case 'delete':
				$follows = $this->follow_repository->get_by_comment( $comment_id );

				if ( empty( $follows ) ) {
					return;
				}

				$follow_ids = array_map(
					function( $follow ) {
						return $follow->id;
					},
					$follows
				);

				// Delete the follows for the deleted comment.
				$this->follow_repository->delete( $follow_ids );
				break;
		}
	}

	/**
	 * Handles the comment deleted event.
	 *
	 * Fires immediately after a comment is deleted from the database.
	 *
	 * Hook: deleted_comment
	 *
	 * @see https://developer.wordpress.org/reference/hooks/deleted_comment/
	 *
	 * @since 0.9.1
	 *
	 * @param string $comment_id The ID of the comment that was deleted.
	 * @return void
	 */
	public function comment_deleted( string $comment_id ) {
		$follows = $this->follow_repository->get_by_comment( $comment_id );

		if ( empty( $follows ) ) {
			return;
		}

		$follow_ids = array_map(
			function( $follow ) {
				return $follow->id;
			},
			$follows
		);

		$this->follow_repository->delete( $follow_ids );
	}

	/**
	 * Maybe adds a new follow for the post author.
	 *
	 * @since 0.9.1
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    Post object.
	 */
	public function maybe_auto_follow_for_author( int $post_id, \WP_Post $post ) {
		if ( $this->settings->should_authors_auto_follow() && $this->system_control->is_post_type_enabled( get_post_type( $post_id ) ) ) {
			$author = get_user_by( 'id', $post->post_author );

			$this->follow_control->add_follow_and_subscription(
				$author->user_email,
				$author->display_name,
				$post_id,
				0,
				CommentForm::FOLLOW_OPTION_ALL_COMMENTS,
				false,
				true
			);
		}
	}

	/**
	 * Handles the post deleted event.
	 *
	 * Fires immediately before a post is deleted from the database.
	 *
	 * Hook: delete_post
	 *
	 * @see https://developer.wordpress.org/reference/hooks/delete_post/
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The ID of the post that was deleted.
	 *
	 * @return void
	 */
	public function post_deleted( int $post_id ) {
		$follows = $this->follow_repository->get_by_post( $post_id );

		if ( empty( $follows ) ) {
			return;
		}

		$follow_ids = array_map(
			function( $follow ) {
				return $follow->id;
			},
			$follows
		);

		$this->follow_repository->delete( $follow_ids );
	}
}
