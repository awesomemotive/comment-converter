<?php
/**
 * Comment Converter Follower Controller.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\RestApi\Controllers;

use CommentConverter\Plugin\Services\FollowControl;
use CommentConverter\Plugin\Database\Repositories\FollowerRepository;
use CommentConverter\Plugin\Exceptions\RestApi\InvalidParamException;
use CommentConverter\Plugin\Exceptions\RestApi\RestApiException;
use CommentConverter\Plugin\Utils\Urls;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follower Controller.
 *
 * @since 0.9.1
 */
class FollowerController extends BaseController {

	/**
	 * Holds the instance of FollowerRepository.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowerRepository
	 */
	protected FollowerRepository $follower_repository;

	/**
	 * Holds the instance of FollowControl.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowControl
	 */
	protected FollowControl $follow_control;

	/**
	 * Constructs a new FollowerController object.
	 *
	 * @since 0.9.1
	 *
	 * @param FollowerRepository $follower_repository The instance of FollowerRepository.
	 * @param FollowControl      $follow_control The instance of FollowControl.
	 */
	public function __construct( FollowerRepository $follower_repository, FollowControl $follow_control ) {
		$this->follower_repository = $follower_repository;
		$this->follow_control      = $follow_control;
	}

	/**
	 * Retrieves a single follower record.
	 *
	 * Route: GET /v1/followers/{id}
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 */
	public function get( \WP_REST_Request $request ) {
		try {
			$id = $this->get_param( $request, 'id', 'int' );
		} catch ( RestApiException $e ) {
			return $e->to_response();
		}

		$follower = $this->follower_repository->get_by_id( $id );

		if ( empty( $follower ) ) {
			return new \WP_REST_Response( array( 'error' => esc_html__( 'Follower not found.', 'subscribe-to-comment-notifications-comment-converter' ) ), 404 );
		}

		return new \WP_REST_Response(
			array_merge(
				$follower->to_array(),
				array(
					'follower_dashboard_url' => Urls::get_follower_dashboard_authenticated_url( $follower ),
				)
			),
			200
		);
	}

	/**
	 * Updates a single follower record.
	 *
	 * Route: PUT /v1/followers/{id}
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 *
	 * @throws InvalidParamException If a request parameter value is invalid.
	 */
	public function update( \WP_REST_Request $request ) {
		try {
			$id = $this->get_param( $request, 'id', 'int' );

			$updated_record = $request->get_json_params();

			if ( empty( $updated_record ) ) {
				throw new InvalidParamException( esc_html__( 'The payload is required.', 'subscribe-to-comment-notifications-comment-converter' ) );
			}
		} catch ( RestApiException $e ) {
			return $e->to_response();
		}

		$follower = $this->follower_repository->get_by_id( $id );

		if ( empty( $follower ) ) {
			return new \WP_REST_Response( array( 'error' => esc_html__( 'Follower not found.', 'subscribe-to-comment-notifications-comment-converter' ) ), 404 );
		}

		$editable_attrs = array( 'name', 'notification_email', 'notification_frequency', 'default_follow_type' );

		// Remove any attributes that are not editable.
		foreach ( $updated_record as $key => $value ) {
			if ( ! in_array( $key, $editable_attrs, true ) ) {
				unset( $updated_record[ $key ] );
			}
		}

		$old_notification_email = $follower->notification_email;

		$follower = $this->follower_repository->update( $follower, $updated_record );

		$data = array(
			'success' => true,
			'updated' => $follower,
		);

		// If changing the email, we need to update the cookie.
		if ( $updated_record['notification_email'] !== $old_notification_email ) {
			$data = array_merge(
				$data,
				array(
					'redirect_url' => Urls::get_follower_dashboard_authenticated_url( $follower ),
				)
			);
		}

		return new \WP_REST_Response( $data, 200 );
	}
}
