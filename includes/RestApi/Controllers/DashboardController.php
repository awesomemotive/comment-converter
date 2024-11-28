<?php
/**
 * Comment Converter Dashboard Controller.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\RestApi\Controllers;

use CommentConverter\Plugin\Database\Repositories\FollowerRepository;
use CommentConverter\Plugin\Database\Repositories\FollowRepository;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Dashboard Controller.
 *
 * @since 0.9.1
 */
class DashboardController extends BaseController {
	/**
	 * The follow repository.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowRepository The follow repository instance.
	 */
	protected FollowRepository $follow_repository;

	/**
	 * The follower repository.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowerRepository The follower repository.
	 */
	protected FollowerRepository $follower_repository;

	/**
	 * Constructs a new DashboardController object.
	 *
	 * @since 0.9.1
	 *
	 * @param FollowRepository   $follow_repository The follow repository.
	 * @param FollowerRepository $follower_repository The follower repository.
	 */
	public function __construct(
		FollowRepository $follow_repository,
		FollowerRepository $follower_repository
	) {
		$this->follow_repository   = $follow_repository;
		$this->follower_repository = $follower_repository;
	}

	/**
	 * Retrieves a dashboard widgets.
	 *
	 * Route: GET /v1/dashboard
	 *
	 * @since 0.9.1
	 *
	 * @return \WP_REST_Response The REST API response.
	 */
	public function get() {
		return new \WP_REST_Response(
			array(
				'widgets' => array(
					'total'                      => array(
						'followers' => $this->follow_repository->get_followers_count(),
						/**
						 * Subscribers count are not available in lite version.
						 * 'subscribers' => $this->follow_repository->get_subscriberllowers_count(),
						 */
					),
					'star_followers'             => $this->build_star_followers_data(),
					'most_followed'              => $this->build_get_most_followed_data(),
					'recently_followed_comments' => $this->build_recently_followed_comments_data(),
				),
			),
			200
		);
	}

	/**
	 * Builds the data for the Dashboard's Star Followers widget.
	 *
	 * @since 0.9.1
	 *
	 * @return array The the Dashboard's Star Followers widget data.
	 */
	protected function build_star_followers_data() {
		$formatted = array();
		$results   = $this->follow_repository->get_followers_with_most_follows();

		foreach ( $results as $result ) {
			$formatted[] = array(
				'follower' => array(
					'id'     => (int) $result->follower->id,
					'name'   => $result->follower->name,
					'avatar' => $result->follower->get_avatar_url(),
				),
				'count'    => $result->count,
			);
		}

		return $formatted;
	}

	/**
	 * Builds the data for the Dashboard's Most Follower widget.
	 *
	 * @since 0.9.1
	 *
	 * @return array The the Dashboard's Most Follower widget data.
	 */
	protected function build_get_most_followed_data() {
		$formatted = array();
		$results   = $this->follow_repository->get_posts_with_most_follows();

		foreach ( $results as $result ) {
			$formatted[] = array(
				'post'  => array(
					'id'        => $result->post->ID,
					'title'     => $result->post->post_title,
					'type'      => $result->post->post_type,
					'permalink' => $result->post->link,
				),
				'count' => $result->count,
			);
		}

		return $formatted;
	}

	/**
	 * Builds the data for the Dashboard's Recently Followed Comments widget.
	 *
	 * @since 0.9.1
	 *
	 * @return array The the Dashboard's Recently Followed Comments widget data.
	 */
	protected function build_recently_followed_comments_data() {
		$formatted = array();
		$results   = $this->follow_repository->get_most_recent_follows_on_comments();

		foreach ( $results as $result ) {
			$formatted[] = array(
				'title'     => $result->post->post_title,
				'comment'   => array(
					'id'      => (int) $result->comment->comment_ID,
					'excerpt' => wp_trim_words( $result->comment->comment_content, 24, '...' ),
				),
				'permalink' => $result->post->link,
				'follower'  => array(
					'id'     => (int) $result->follower->id,
					'name'   => $result->follower->name,
					'avatar' => $result->follower->get_avatar_url(),
				),
			);
		}

		return $formatted;
	}
}
