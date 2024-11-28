<?php
/**
 * Comment Converter Follow Model.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Database\Models;

use CommentConverter\Plugin\Utils\Date;
use WP_Comment;
use WP_Post;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follow Model.
 *
 * @since 0.9.1
 */
class Follow extends BaseModel {

	const TYPE_COMMENT_REPLIES = 'replies';
	const TYPE_ALL_COMMENTS    = 'all';
	const TYPE_NO_FOLLOW       = 'no';

	/**
	 * The table associated with the model.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected string $table = 'ccvtr_follows';

	/**
	 * The fillable attributes for the model.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected array $fillable = array(
		'id',
		'post_id',
		'comment_id',
		'follower_id',
		'type',
		'has_subscribed',
		'confirmed',
		'created',
		'updated',
	);

	/**
	 * The model's relations.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected array $relations = array(
		'post',
		'follower',
	);

	/**
	 * The follower associated with the follow.
	 *
	 * This property is meant to be hydrated by the FollowRepository.
	 *
	 * @since 0.9.1
	 *
	 * @var Follower $follower The follower associated with the follow.
	 */
	protected Follower $follower;

	/**
	 * The post associated with the follow.
	 *
	 * This property is meant to be hydrated by the FollowRepository.
	 *
	 * @since 0.9.1
	 *
	 * @var WP_Post $post The post associated with the follow.
	 */
	protected WP_Post $post;

	/**
	 * The comment associated with the follow.
	 *
	 * This property is meant to be hydrated by the FollowRepository.
	 *
	 * @since 0.9.1
	 *
	 * @var WP_Comment $comment The comment associated with the follow.
	 */
	public ?WP_Comment $comment;

	/**
	 * Determines if the current record is for all comments in a post.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the current record is for all comments in a post, false otherwise.
	 */
	public function is_following_all_comments() {
		return ! empty( $this->attributes['type'] ) && self::TYPE_ALL_COMMENTS === $this->attributes['type'];
	}

	/**
	 * Determines if the current record is for replies of a specific comment.
	 *
	 * @since 0.9.1
	 *
	 * @param int $comment_id The comment id to check.
	 *
	 * @return bool True if the current record is for replies of a specific comment, false otherwise.
	 */
	public function is_following_comment( $comment_id ) {
		return $this->is_following_comment_replies() && $this->attributes['comment_id'] === $comment_id;
	}

	/**
	 * Determines if the current record is for replies in a comment.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the current record is for replies in a comment, false otherwise.
	 */
	public function is_following_comment_replies() {
		return ! empty( $this->attributes['type'] ) && self::TYPE_COMMENT_REPLIES === $this->attributes['type'];
	}

	/**
	 * Determines if the current record is for a no-follow.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the current record is for a no-follow, false otherwise.
	 */
	public function is_no_follow() {
		return empty( $this->attributes['type'] ) || self::TYPE_NO_FOLLOW === $this->attributes['type'];
	}

	/**
	 * Determines if the follow is confirmed.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the follow is confirmed, false otherwise.
	 */
	public function is_confirmed() {
		return ! empty( $this->attributes['confirmed'] );
	}

	/**
	 * Determines if the follow is active.
	 *
	 * A follow is considered active if it has been confirmed and is not a no-follow.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the follow is active, false otherwise.
	 */
	public function is_active() {
		return $this->is_confirmed() && ! $this->is_no_follow();
	}

	/**
	 * Determines if the follow is folowing something (post or replies) as opposed to nothing (no-follow).
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the follow is folowing something, false otherwise.
	 */
	public function is_following() {
		return ! $this->is_no_follow();
	}

	/**
	 * Determines if the current record has subscribed.
	 *
	 * This means the user chose to subscribe when this follow record was created.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the current record has subscribed, false otherwise.
	 */
	public function has_subscribed() {
		return ! empty( $this->attributes['has_subscribed'] );
	}

	/**
	 * Retrieves the follower associated with this follow.
	 *
	 * @since 0.9.1
	 *
	 * @return Follower|null Returns the follower object if it exists, null otherwise.
	 */
	public function get_follower() {
		if ( empty( $this->follower ) && ! empty( $this->attributes['follower_id'] ) ) {
			$this->follower = ( new Follower() )->find( $this->attributes['follower_id'] );
		}

		return $this->follower;
	}

	/**
	 * Retrieves the post associated with this follow.
	 *
	 * @since 0.9.1
	 *
	 * @return WP_Post|null Returns the post object if it exists, null otherwise.
	 */
	public function get_post() {
		if ( empty( $this->post ) && ! empty( $this->attributes['post_id'] ) ) {
			$this->post = get_post( $this->attributes['post_id'] );
		}

		return $this->post;
	}

	/**
	 * {@inheritdoc}
	 */
	public function to_array() {
		$attrs = parent::to_array();

		if ( ! empty( $this->follower ) ) {
			$attrs['follower'] = $this->follower->to_array();
		}

		if ( ! empty( $this->post ) ) {
			$attrs['post'] = $this->post;
		}

		if ( ! empty( $this->comment ) ) {
			$attrs['comment'] = $this->comment;
		}

		if ( ! empty( $this->confirmed ) ) {
			$attrs['confirmed_formatted'] = Date::format_date_str( $this->confirmed );
		}

		$attrs['post_id']        = intval( $attrs['post_id'] ?? 0 );
		$attrs['comment_id']     = intval( $attrs['comment_id'] ?? 0 );
		$attrs['follower_id']    = intval( $attrs['follower_id'] ?? 0 );
		$attrs['has_subscribed'] = boolval( $attrs['has_subscribed'] ?? false );

		return $attrs;
	}
}
