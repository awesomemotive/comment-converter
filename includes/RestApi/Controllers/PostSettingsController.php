<?php
/**
 * Comment Converter Post Settings Controller.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\RestApi\Controllers;

use CommentConverter\Plugin\Exceptions\RestApi\InvalidParamException;
use CommentConverter\Plugin\Exceptions\RestApi\RestApiException;
use CommentConverter\Plugin\Services\DataStats;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Post Settings Controller.
 *
 * @since 0.9.1
 */
class PostSettingsController extends BaseController {

	/**
	 * The follow repository.
	 *
	 * @since 0.9.1
	 *
	 * @var DataStats The follow repository.
	 */
	protected DataStats $data_stats;

	/**
	 * Constructs a new FollowController object.
	 *
	 * @since 0.9.1
	 *
	 * @param DataStats $data_stats The instance for DataStats.
	 */
	public function __construct( DataStats $data_stats ) {
		$this->data_stats = $data_stats;
	}

	/**
	 * Retrieves the counts of followers and subscribers for a post.
	 *
	 * Route: /v1/post-settings/{post_id}
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 *
	 * @throws InvalidParamException If a request parameter value is invalid.
	 */
	public function get_counts( \WP_REST_Request $request ) {
		try {
			$post_id = $this->get_param( $request, 'post_id', 'int' );

			if ( empty( $post_id ) ) {
				throw new InvalidParamException( esc_html__( 'The post id param is required.', 'subscribe-to-comment-notifications-comment-converter' ), 400 );
			}
		} catch ( RestApiException $e ) {
			return $e->to_response();
		}

		$post_stats = $this->data_stats->get_post_stats( $post_id );

		return new \WP_REST_Response(
			array(
				'followers'         => $post_stats['followers'] ?? 0,
				'subscribers'       => $post_stats['subscribers'] ?? 0,
				'post_id'           => $post_id,
				'is_email_required' => (bool) get_option( 'require_name_email' ),
			),
			200
		);
	}

}
