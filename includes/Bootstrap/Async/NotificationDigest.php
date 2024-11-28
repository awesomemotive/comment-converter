<?php
/**
 * Comment Converter Notification Email.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Async;

use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Database\Repositories\FollowerRepository;
use CommentConverter\Plugin\Database\Repositories\FollowRepository;
use CommentConverter\Plugin\Emails\NotificationEmail;
use CommentConverter\Plugin\Services\EmailControl;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\VariableReplacer;
use DateTime;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Notification Email.
 *
 * @since 0.9.1
 */
class NotificationDigest {

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

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
	 * Holds the instance of VariableReplacer.
	 *
	 * @since 0.9.1
	 *
	 * @var VariableReplacer
	 */
	protected $variable_replacer;

	/**
	 * Holds the post ids of the follower's "all comments" follows.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected $post_ids;

	/**
	 * Holds the comment parent ids of the follower's "all replies" follows.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected $comment_parent_ids;

	/**
	 * Holds the instance of Follower.
	 *
	 * @since 0.9.1
	 *
	 * @var Follower
	 */
	protected $follower;

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
	 *
	 * @param Settings           $settings            Instance of Settings.
	 * @param FollowerRepository $follower_repository Instance of FollowerRepository.
	 * @param FollowRepository   $follow_repository   Instance of FollowRepository.
	 * @param VariableReplacer   $variable_replacer   Instance of VariableReplacer.
	 * @param EmailControl       $email_control       Instance of EmailControl.
	 */
	public function __construct( Settings $settings, FollowerRepository $follower_repository, FollowRepository $follow_repository, VariableReplacer $variable_replacer, EmailControl $email_control ) {
		$this->settings            = $settings;
		$this->follower_repository = $follower_repository;
		$this->follow_repository   = $follow_repository;
		$this->variable_replacer   = $variable_replacer;
		$this->email_control       = $email_control;

		// Ensure our cron events are scheduled.
		if ( ! \wp_next_scheduled( 'ccvtr_notification_digest_cron_daily' ) ) {
			self::schedule_cron_event( 'daily' );
		}

		if ( ! \wp_next_scheduled( 'ccvtr_notification_digest_cron_weekly' ) ) {
			self::schedule_cron_event( 'weekly' );
		}
	}

	/**
	 * Sets up the hooks for the digest notifications.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		// Respond to our cron hooks.
		add_action( 'ccvtr_notification_digest_cron_daily', array( $this, 'init_digests_daily' ) );
		add_action( 'ccvtr_notification_digest_cron_weekly', array( $this, 'init_digests_weekly' ) );

		// Respond to our async actions.
		add_action( 'ccvtr_send_follower_notification_digest', array( $this, 'send_follower_digest' ) );
	}

	/**
	 * Initialize the tasks for sending notification digests for the specified frequency.
	 *
	 * @since 0.9.1
	 *
	 * @param string $notification_frequency The notification frequency.
	 *
	 * @return void
	 */
	protected function init_digests( string $notification_frequency ) {
		// Get all the followers requesting daily notifications.
		$followers = $this->follower_repository->get_by_notification_frequency( $notification_frequency );

		// Asynchronously send the emails for each follower.
		foreach ( $followers as $follower ) {
			as_enqueue_async_action( 'ccvtr_send_follower_notification_digest', array( 'follower_id' => (int) $follower->id ), 'comment_converter' );
		}
	}

	/**
	 * Initialize the tasks for sending daily notification digests.
	 *
	 * By default this runs daily at 4 AM.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init_digests_daily() {
		$this->init_digests( 'daily' );
	}

	/**
	 * Initialize the tasks for sending weekly notification digests.
	 *
	 * By default this runs every Sunday at 4 AM.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init_digests_weekly() {
		$this->init_digests( 'weekly' );
	}

	/**
	 * Sends the follower notification digest.
	 *
	 * @since 0.9.1
	 *
	 * @param int $follower_id The follower id.
	 *
	 * @return void
	 */
	public function send_follower_digest( int $follower_id ) {
		$follower = $this->follower_repository->get_by_id( $follower_id );

		// Bail early if the follower can't be found.
		if ( ! $follower ) {
			return;
		}

		// Bail early if we don't have an email address.
		if ( empty( $follower->notification_email ) ) {
			return;
		}

		$follows = $this->follow_repository->get_by_follower_id( $follower->id );

		// If the user has no followis, bail.
		if ( empty( $follows ) ) {
			return;
		}

		$this->follower           = $follower;
		$this->post_ids           = array();
		$this->comment_parent_ids = array();

		foreach ( $follows as $follow ) {
			// If the followi is not active, skip it.
			if ( ! $follow->is_active() ) {
				continue;
			}

			// If the follow is for replies to a specific comment, add the comment id to the array.
			if ( $follow->is_following_comment_replies() ) {
				$this->comment_parent_ids[] = $follow->comment_id;
			}

			// If the follow is for all comments on a specific post, add the post id to the array.
			if ( $follow->is_following_all_comments() ) {
				$this->post_ids[] = $follow->post_id;
			}
		}

		// There are no active follows for this follower.
		if ( empty( $this->comment_parent_ids ) && empty( $this->post_ids ) ) {
			return;
		}

		$comments = $this->get_comments();

		// If there are not comments for the time period, bail.
		if ( empty( $comments ) ) {
			return;
		}

		// Send the email.
		$email = new NotificationEmail( $this->settings, $comments, $this->variable_replacer );

		// Send the email.
		$this->email_control->send( $email->set_notifiee( $this->follower ) );
	}

	/**
	 * Returns the comments for the notification digest time period.
	 *
	 * @since 0.9.1
	 *
	 * @return WP_Comment[]
	 */
	protected function get_comments() {

		// Set up the initial time strings (`daily`).
		$before_string = 'yesterday';
		$after_string  = 'yesterday';

		// Adjust the after time string for the weekly digest.
		if ( 'weekly' === $this->follower->notification_frequency ) {
			$after_string = '7 days ago';
		}

		// Set up the before/after date objects.
		$timezone = wp_timezone();
		$before   = new DateTime( $before_string, $timezone );
		$after    = new DateTime( $after_string, $timezone );

		/**
		 * Filters the args passed to `get_comments`.
		 *
		 * @since 0.9.1
		 *
		 * @param array    $args     An array of `WP_Comment_Query` compatible args.
		 * @param Follower $follower The Follower object for the current digest.
		 */
		$comments_query_args = apply_filters(
			'ccvtr_notification_digest_get_comments_args',
			array(
				'order'       => 'ASC',
				'number'      => 50,
				'status'      => 'approve',
				'type'        => 'comment',
				'post_type'   => 'any',
				'post_status' => 'publish',
				'date_query'  => array(
					'relation' => 'AND',
					'column'   => 'comment_date',
					array(
						'before'    => array(
							'year'  => $before->format( 'Y' ),
							'month' => $before->format( 'm' ),
							'day'   => $before->format( 'd' ),
						),
						'after'     => array(
							'year'  => $after->format( 'Y' ),
							'month' => $after->format( 'm' ),
							'day'   => $after->format( 'd' ),
						),
						'inclusive' => true,
					),
				),
			),
			$this->follower
		);

		// We need to filter the comments clauses to set up the additional conditions.
		add_filter( 'comments_clauses', array( $this, 'filter_comments_clauses' ), 2, 2 );

		$comments = get_comments( $comments_query_args );

		// Remove the filter to prevent potential conflicts with other `WP_Comment_Query` calls.
		remove_filter( 'comments_clauses', array( $this, 'filter_comments_clauses' ), 2, 2 );

		/**
		 * Filters the return of `NotificationDigest::get_comments`.
		 *
		 * @since 0.9.1
		 *
		 * @param WP_Comment[] $comments An array of `WP_Comment` objects.
		 * @param Follower     $follower The Follower object for the current digest.
		 */
		$comments = apply_filters( 'ccvtr_notification_digest_get_comments', $comments, $this->follower );

		return $comments;
	}

	/**
	 * Returns updated clauses array when retrieving comments for notification digests.
	 *
	 * @since 0.9.1
	 *
	 * @param string[]         $clauses       An associative array of comment query clauses.
	 * @param WP_Comment_Query $comment_query The `WP_Comment_Query` object.
	 *
	 * @return string[]
	 */
	public function filter_comments_clauses( $clauses = array(), $comment_query = null ) {
		// If our parameters are invalid, bail.
		if ( ! is_array( $clauses ) || ! $comment_query ) {
			return $clauses;
		}

		/**
		 * Filters the `comments_clauses` value before Comment Converter makes it's changes.
		 *
		 * Returning a truthy value from the filter will effectively short-circuit
		 * Comment Converter's changes, and return the passed value instead.
		 *
		 * @since 0.9.1
		 *
		 * @param bool $pre
		 * @param string[]         $clauses            An associative array of comment query clauses.
		 * @param WP_Comment_Query $comment_query      The `WP_Comment_Query` object.
		 * @param array            $comment_parent_ids The `WP_Comment_Query` object.
		 * @param array            $post_ids           The `WP_Comment_Query` object.
		 */
		$pre = apply_filters(
			'ccvtr_notification_digest_filter_comments_clauses_pre',
			false,
			$clauses,
			$comment_query,
			$this->comment_parent_ids,
			$this->post_ids
		);

		if ( false !== $pre ) {
			return $pre;
		}

		global $wpdb;

		// Exclude the follower by email address.
		$clauses['where'] .= $wpdb->prepare( ' AND comment_author_email != %s', $this->follower->notification_email );

		// Maybe exclude the follower by user id.
		if ( ! empty( (int) $this->follower->user_id ) ) {
			$clauses['where'] .= $wpdb->prepare( ' AND user_id != %s', $this->follower->user_id );
		}

		// Set up the array to hold the comment parent/post id queries.
		$or_clauses = array();

		// Maybe set up the comment parent ids clause.
		if ( ! empty( $this->comment_parent_ids ) ) {
			$or_clauses[] = 'comment_parent IN ( ' . implode( ',', wp_parse_id_list( $this->comment_parent_ids ) ) . ' )';
		}

		// Maybe set up the comment post ids clause.
		if ( ! empty( $this->post_ids ) ) {
			$or_clauses[] = 'comment_post_ID IN ( ' . implode( ',', wp_parse_id_list( $this->post_ids ) ) . ' )';
		}

		// The comment parent/post id need to evaluated as `OR` conditions.
		$clauses['where'] .= ' AND ( ' . join( ' OR ', $or_clauses ) . ' )';

		return $clauses;
	}

	/**
	 * Setup cron schedules for delivering notification digests.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public static function register_cron() {
		self::schedule_cron_event( 'daily' );
		self::schedule_cron_event( 'weekly' );
	}

	/**
	 * Returns the first cron date for the specified cron type.
	 *
	 * @since 0.9.1
	 *
	 * @param string $cron_type Expects `daily` or `weekly`.
	 *
	 * @return void
	 */
	protected static function schedule_cron_event( $cron_type = 'daily' ) {
		// Set the cron to run every day/week at 4:00 AM relative the the site's configured time zone.
		$time_strings = array(
			'daily'  => 'tomorrow 4 am',
			'weekly' => 'next Sunday 4 am',
		);

		$date = absint( strtotime( $time_strings[ $cron_type ] ) - ( get_option( 'gmt_offset' ) * HOUR_IN_SECONDS ) );
		$date = $date ? $date : time();

		wp_schedule_event( $date, $cron_type, 'ccvtr_notification_digest_cron_' . $cron_type );
	}
}
