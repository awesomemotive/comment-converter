<?php
/**
 * Comment Converter Follower Repository.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Database\Repositories;

use CommentConverter\Plugin\Database\Models\Follower;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follower Repository.
 *
 * @since 0.9.1
 */
class FollowerRepository extends BaseRepository {

	/**
	 * {@inheritDoc}
	 */
	public function get_model_class() {
		return Follower::class;
	}

	/**
	 * Retrieves a follower by their email address.
	 *
	 * @since 0.9.1
	 *
	 * @param string $email The email address of the follower to retrieve.
	 *
	 * @return Follower|null The follower data, or null if not found.
	 */
	public function get_by_email( string $email ) {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
		$results = $wpdb->get_results(
			$wpdb->prepare(
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder -- Already prepared.
				"SELECT * FROM %i WHERE notification_email = %s",
				$this->table_name,
				$email
			)
		);

		if ( empty( $results ) ) {
			return null;
		}

		return $this->hydrate_results( $results )[0];
	}

	/**
	 * Retrieves a follower by user id.
	 *
	 * @since 0.9.1
	 *
	 * @param int $user_id The user id of the follower to retrieve.
	 *
	 * @return Follower|null The follower data, or null if not found.
	 */
	public function get_by_user_id( int $user_id ) {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
		$results = $wpdb->get_results(
			$wpdb->prepare(
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder -- Already prepared.
				"SELECT * FROM %i WHERE user_id = %d",
				$this->table_name,
				$user_id
			)
		);

		if ( empty( $results ) ) {
			return null;
		}

		return $this->hydrate_results( $results )[0];
	}

	/**
	 * Retrieves a follower by unique key.
	 *
	 * @since 0.9.1
	 *
	 * @param string $unique_key The unique key of the follower to retrieve.
	 *
	 * @return Follower|null The follower data, or null if not found.
	 */
	public function get_by_unique_key( string $unique_key ) {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
		$results = $wpdb->get_results(
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder -- Already prepared.
			$wpdb->prepare( "SELECT * FROM %i WHERE unique_key = %s", $this->table_name, $unique_key )
		);

		if ( empty( $results ) ) {
			return null;
		}

		return $this->hydrate_results( $results )[0];
	}

	/**
	 * Returns an array of followers by notification frequency.
	 *
	 * @since 0.9.1
	 *
	 * @param string $notification_frequency The `notification_frequency` to retrieve.
	 *
	 * @return array
	 */
	public function get_by_notification_frequency( $notification_frequency = 'daily' ) {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
		$results = $wpdb->get_results(
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
			$wpdb->prepare( "SELECT * FROM %i WHERE is_verified = 1 AND notification_frequency = %s", $this->table_name, $notification_frequency )
		);

		return $this->hydrate_results( $results );
	}

	/**
	 * Finds or creates a follower in the database.
	 *
	 * @since 0.9.1
	 *
	 * @param string $email The email address of the follower to update or create.
	 * @param string $name The name of the follower to update or create.
	 * @param bool   $verified Whether the follower should be created as verified.
	 * @param int    $user_id The user id.
	 *
	 * @return Follower The found or created follower.
	 */
	public function first_or_create( string $email, string $name, bool $verified = false, int $user_id = 0 ) {
		$follower = $this->get_by_email( $email );

		if ( ! $follower ) {
			return $this->add( $email, $name, $verified, $user_id );
		}

		if ( ! empty( $user_id ) && empty( $follower->user_id ) ) {
			$follower->user_id = $user_id;
			$follower->save();
		}

		return $follower;
	}

	/**
	 * Sets a follower as a subscriber.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower $follower The follower to set as a subscriber.
	 *
	 * @return Follower The updated follower.
	 */
	public function set_subscriber( Follower $follower ) {
		// The is_subscriber flag is only set once. Once a subscriber, always a subscriber. The is_subscriber
		// flag only tells us whether a user chose to subscribe at least once. It's meant to only be set once
		// we have confirmed the user subscription.
		if ( $follower->is_subscriber() ) {
			return $follower;
		}

		$follower->is_subscriber = true;
		$follower->save();

		return $follower;
	}

	/**
	 * Adds a new follower to the database.
	 *
	 * @since 0.9.1
	 *
	 * @param string $email The email address of the follower to add.
	 * @param string $name The name of the follower to add.
	 * @param bool   $verified Whether the follower should be created as verified.
	 * @param int    $user_id The user id.
	 *
	 * @return Follower The newly added follower.
	 */
	public function add( string $email, string $name = '', bool $verified = false, int $user_id = 0 ) {
		$salt       = time();
		$unique_key = md5( $salt . $email );

		$new_follower = ( new Follower() )->fill(
			array(
				'name'               => $name,
				'notification_email' => $email,
				'salt'               => $salt,
				'unique_key'         => $unique_key,
				'is_verified'        => $verified,
				'user_id'            => $user_id,
			)
		);

		$new_follower->save();

		return $new_follower;
	}

	/**
	 * Verifies the specified followers.
	 *
	 * @since 0.9.1
	 *
	 * @param array $follower_ids An array of follower IDs to verify.
	 *
	 * @return int The number of followers that were verified.
	 */
	public function verify( $follower_ids ) {
		return $this->update_batch(
			$follower_ids,
			array(
				'is_verified' => 1,
			),
		);
	}
}
