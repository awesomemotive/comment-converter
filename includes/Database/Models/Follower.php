<?php
/**
 * Comment Converter Follower Model.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Database\Models;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follower Model.
 *
 * @since 0.9.1
 */
class Follower extends BaseModel {

	/**
	 * The table associated with the model.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected string $table = 'ccvtr_followers';

	/**
	 * The fillable attributes for the model.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected array $fillable = array(
		'id',
		'name',
		'notification_email',
		'notification_frequency',
		'default_follow_type',
		'user_id',
		'is_verified',
		'is_subscriber',
		'salt',
		'unique_key',
		'created',
		'updated',
	);

	/**
	 * Determines if the follower is a subscriber.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the follower is a subscriber, false otherwise.
	 */
	public function is_subscriber() {
		return ! empty( $this->attributes['is_subscriber'] );
	}

	/**
	 * Determines if the follower is verified.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the follower is verified, false otherwise.
	 */
	public function is_verified() {
		return ! empty( $this->attributes['is_verified'] );
	}

	/**
	 * Get the follower avatar based on the notification email.
	 *
	 * @since 0.9.1
	 *
	 * @return string The follower avatar URL.
	 */
	public function get_avatar_url() {
		return get_avatar_url( $this->attributes['notification_email'] ?? '' );
	}

	/**
	 * {@inheritdoc}
	 */
	public function to_array() {
		$attrs = parent::to_array();

		if ( ! empty( $this->attributes['notification_email'] ) ) {
			$attrs['avatar'] = $this->get_avatar_url();
		}

		$attrs['user_id']       = intval( $attrs['user_id'] ?? 0 );
		$attrs['is_verified']   = boolval( $attrs['is_verified'] ?? false );
		$attrs['is_subscriber'] = boolval( $attrs['is_subscriber'] ?? false );

		return $attrs;
	}
}
