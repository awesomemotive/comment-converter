<?php
/**
 * Comment Converter Follow Controller.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\RestApi\Controllers;

use CommentConverter\Plugin\Bootstrap\Frontend\CommentForm;
use CommentConverter\Plugin\Services\FollowControl;
use CommentConverter\Plugin\Database\Repositories\FollowerRepository;
use CommentConverter\Plugin\Database\Repositories\FollowRepository;
use CommentConverter\Plugin\Exceptions\RestApi\AuthorizationException;
use CommentConverter\Plugin\Exceptions\RestApi\InvalidParamException;
use CommentConverter\Plugin\Exceptions\RestApi\RestApiException;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follow Controller.
 *
 * @since 0.9.1
 */
class FollowController extends BaseController {

	/**
	 * The follow repository.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowRepository The follow repository.
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
	 * Holds the instance of FollowControl.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowControl
	 */
	protected $follow_control;

	/**
	 * Constructs a new FollowController object.
	 *
	 * @since 0.9.1
	 *
	 * @param FollowRepository   $follow_repository The follow repository.
	 * @param FollowerRepository $follower_repository The follower repository.
	 * @param FollowControl      $follow_control The follow control instance.
	 */
	public function __construct( FollowRepository $follow_repository, FollowerRepository $follower_repository, FollowControl $follow_control ) {
		$this->follow_repository   = $follow_repository;
		$this->follower_repository = $follower_repository;
		$this->follow_control      = $follow_control;
	}

	/**
	 * Retrieves a paginated list of follows based on the specified arguments.
	 *
	 * Route: GET /v1/follows
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 */
	public function index( \WP_REST_Request $request ) {
		try {
			$page        = $this->get_param( $request, 'page', 'int' );
			$type        = $this->get_param( $request, 'type', 'string', array( 'all', 'replies', 'subscribed', 'pending', 'confirmed' ) );
			$date        = $this->get_param( $request, 'date', 'string', array( '', 'last-7-days', 'last-30-days' ) );
			$search      = $this->get_param( $request, 'search', 'string' );
			$sort_by     = $this->get_param( $request, 'sort_by', 'string', array( 'follower', 'follow_type', 'created', 'has_subscribed' ) );
			$sort_order  = $this->get_param( $request, 'sort_order', 'string', array( 'asc', 'desc' ) );
			$post_id     = $this->get_param( $request, 'post_id', 'int' );
			$comment_id  = $this->get_param( $request, 'comment_id', 'int' );
			$follower_id = $this->get_param( $request, 'follower_id', 'int' );
		} catch ( RestApiException $e ) {
			return $e->to_response();
		}

		$data = $this->follow_repository->list(
			array(
				'page'        => $page,
				'type'        => $type,
				'date'        => $date,
				'search'      => $search,
				'sort_by'     => $sort_by,
				'sort_order'  => $sort_order,
				'post_id'     => $post_id,
				'comment_id'  => $comment_id,
				'follower_id' => $follower_id,
			),
			array( 'follower', 'post', 'comment' ),
		);

		return new \WP_REST_Response( $data, 200 );
	}

	/**
	 * Performs an action on a list of follows.
	 *
	 * Route: POST /v1/follows/{action}
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 *
	 * @throws InvalidParamException If a request parameter value is invalid.
	 */
	public function action( \WP_REST_Request $request ) {
		$follow_actions = array( 'follow-all', 'follow-replies', 'confirm', 'unsubscribe', 'delete' );

		try {
			$action     = $this->get_param( $request, 'action', 'string', $follow_actions );
			$follow_ids = $this->get_param( $request, 'ids', 'array' );

			if ( empty( $follow_ids ) ) {
				throw new InvalidParamException( esc_html__( 'The ids param is required.', 'comment-notifications' ) );
			}
		} catch ( RestApiException $e ) {
			return $e->to_response();
		}

		$affected = 0;

		switch ( $action ) {
			case 'follow-all':
				$affected = $this->follow_repository->switch_to_follow_all( $follow_ids );
				break;
			case 'follow-replies':
				$affected = $this->follow_repository->switch_to_follow_replies( $follow_ids );
				break;
			case 'confirm':
				$affected = $this->follow_repository->confirm( $follow_ids );

				$follows = $this->follow_repository->get_by_ids( $follow_ids );

				$follower_ids = array_map(
					function( $follow ) {
						return $follow->follower_id;
					},
					$follows
				);

				$this->follower_repository->verify( $follower_ids );
				break;
			case 'unsubscribe':
				$affected = $this->follow_repository->delete( $follow_ids );
				break;
			case 'delete':
				$affected = $this->follow_repository->delete( $follow_ids );
				break;
		}

		return new \WP_REST_Response(
			array(
				'success'       => true,
				'affected_rows' => $affected,
			),
			200
		);
	}

	/**
	 * Deletes a single follow record.
	 *
	 * Route: DELETE /v1/follows/{id}
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 *
	 * @throws InvalidParamException If a request parameter value is invalid.
	 */
	public function delete( \WP_REST_Request $request ) {
		try {
			$id = $this->get_param( $request, 'id', 'int' );
		} catch ( RestApiException $e ) {
			return $e->to_response();
		}

		$follower = $this->follow_repository->get_by_id( $id );

		if ( empty( $follower ) ) {
			return new \WP_REST_Response( array( 'error' => esc_html__( 'Follow not found.', 'comment-notifications' ) ), 404 );
		}

		$affected = $this->follow_repository->delete( $id );

		return new \WP_REST_Response(
			array(
				'success'       => true,
				'affected_rows' => $affected,
			),
			200
		);
	}

	/**
	 * Adds a new follow record.
	 *
	 * Route: POST /v1/follows
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 *
	 * @throws AuthorizationException If the request is not authorized.
	 */
	public function post( \WP_REST_Request $request ) {
		try {
			$post_id   = $this->get_param( $request, 'post_id', 'int' );
			$email     = $this->get_param( $request, 'email', 'email' );
			$name      = $this->get_param( $request, 'name', 'string' );
			$subscribe = $this->get_param( $request, 'subscribe', 'bool' );
			$nonce     = $this->get_param( $request, 'nonce', 'string' );

			if ( ! wp_verify_nonce( $nonce, 'ccvtr-follow-by-email-' . $post_id ) ) {
				throw new AuthorizationException( esc_html__( 'The follow could not be created.', 'comment-notifications' ) );
			}
		} catch ( RestApiException $e ) {
			return $e->to_response();
		}

		try {
			$this->follow_control->add_follow_and_subscription(
				$email,
				$name,
				$post_id,
				0,
				CommentForm::FOLLOW_OPTION_ALL_COMMENTS,
				$subscribe
			);
		} catch ( \Exception $e ) {
			return ( new RestApiException( esc_html__( 'An error occured when creating the follow.', 'comment-notifications' ) ) )
				->set_extra_error( $e->getMessage() )
				->to_response();
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
			),
			200
		);
	}

	/**
	 * Adds a new follow record for a comment.
	 *
	 * Route: POST /v1/comment-follows
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 *
	 * @throws AuthorizationException If the request is not authorized.
	 */
	public function post_comment( \WP_REST_Request $request ) {
		try {
			$comment_id = $this->get_param( $request, 'comment_id', 'int' );
			$nonce      = $this->get_param( $request, 'nonce', 'string' );

			// Validate nonce.
			if ( ! wp_verify_nonce( $nonce, 'ccvtr-follow-confirmation-' . $comment_id ) ) {
				throw new AuthorizationException( esc_html__( 'The follow could not be created.', 'comment-notifications' ) );
			}
		} catch ( RestApiException $e ) {
			return $e->to_response();
		}

		try {
			$comment = get_comment( $comment_id );

			if ( empty( $comment ) ) {
				return new \WP_REST_Response( array( 'error' => esc_html__( 'Comment not found.', 'comment-notifications' ) ), 404 );
			}

			$this->follow_control->process_follow_and_subscription(
				$comment,
				array(
					'follow' => CommentForm::FOLLOW_OPTION_COMMENT_REPLIES,
				)
			);
		} catch ( \Exception $e ) {
			return ( new RestApiException( esc_html__( 'An error occured when creating the comment follow.', 'comment-notifications' ) ) )
				->set_extra_error( $e->getMessage() )
				->to_response();
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
			),
			200
		);
	}
}
