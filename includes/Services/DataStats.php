<?php
/**
 * Comment Converter Data Stats.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Services;

use CommentConverter\Plugin\Database\Repositories\FollowRepository;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Data Stats.
 *
 * @since 0.9.1
 */
class DataStats {

	/**
	 * The follow repository.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowRepository The follow repository.
	 */
	protected FollowRepository $follow_repository;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param FollowRepository $follow_repository The follow repository.
	 */
	public function __construct( FollowRepository $follow_repository ) {
		$this->follow_repository = $follow_repository;
	}

	/**
	 * Retrieves the stats for a specific post.
	 *
	 * @since 0.9.1
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return array The stats for the post.
	 */
	public function get_post_stats( $post_id ) {
		$counts = $this->follow_repository->get_counts_by_posts( array( $post_id ) );

		return array(
			'followers'   => $counts[ $post_id ] ?? 0,
			'subscribers' => 0, // Future feature.
		);
	}

}
