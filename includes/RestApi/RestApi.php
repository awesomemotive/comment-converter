<?php
/**
 * Comment Converter REST API.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\RestApi;

use CommentConverter\Plugin\Services\FollowerControl;
use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Exceptions\RestApi\RestApiException;
use CommentConverter\Plugin\Plugin;
use CommentConverter\Plugin\RestApi\Controllers\AMPluginsController;
use CommentConverter\Plugin\RestApi\Controllers\DashboardController;
use CommentConverter\Plugin\RestApi\Controllers\FollowerController;
use CommentConverter\Plugin\RestApi\Controllers\FollowController;
use CommentConverter\Plugin\RestApi\Controllers\SettingsController;
use CommentConverter\Plugin\RestApi\Controllers\PostSettingsController;
use CommentConverter\Plugin\RestApi\Controllers\UploadController;
use CommentConverter\Plugin\Utils\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter REST API.
 *
 * @since 0.9.1
 */
class RestApi {

	/**
	 * The REST API Namespace
	 *
	 *  @since 0.9.1
	 *
	 * @var string The namespace
	 */
	protected $namespace = 'ccvtr/v1';

	/**
	 * Holds the instance of FollowerControl.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowerControl
	 */
	protected $follower_control;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param FollowerControl $follower_control Instance of FollowerControl.
	 */
	public function __construct( FollowerControl $follower_control ) {
		$this->follower_control = $follower_control;
	}

	/**
	 * Sets up the hooks for the REST API.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );

		// Replace the default WordPress REST API dispatcher with our own.
		add_filter( 'rest_dispatch_request', array( $this, 'resolve_route' ), 10, 4 );

		add_filter( 'rest_allowed_cors_headers', array( $this, 'set_allow_headers' ), 999 );
	}

	/**
	 * Returns an array of REST API route definitions.
	 *
	 * @since 0.9.1
	 *
	 * @return array An array of REST API routes.
	 */
	public function get_routes() {
		return array(
			'post-settings/(?P<post_id>[\d]+)' => array(
				'methods'             => \WP_REST_Server::READABLE,
				'permission_callback' => array( $this, 'logged_in_and_can_access_route' ),
				'callback'            => array( PostSettingsController::class, 'get_counts' ),
			),
			'follows'                          => array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'permission_callback' => array( $this, 'logged_in_or_current_follower' ),
					'callback'            => array( FollowController::class, 'index' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'permission_callback' => '__return_true',
					'callback'            => array( FollowController::class, 'post' ),
				),
			),
			'comment-follows'                  => array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'permission_callback' => '__return_true',
				'callback'            => array( FollowController::class, 'post_comment' ),
			),
			'follows/(?P<action>[\w-]+)'       => array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'permission_callback' => array( $this, 'logged_in_or_current_follower' ),
				'callback'            => array( FollowController::class, 'action' ),
			),
			'follows/(?P<id>[\d]+)'            => array(
				'methods'             => \WP_REST_Server::DELETABLE,
				'permission_callback' => array( $this, 'logged_in_or_current_follower' ),
				'callback'            => array( FollowController::class, 'delete' ),
			),
			'followers/(?P<id>[\d]+)'          => array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'permission_callback' => array( $this, 'logged_in_or_current_follower' ),
					'callback'            => array( FollowerController::class, 'get' ),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'permission_callback' => array( $this, 'logged_in_or_current_follower' ),
					'callback'            => array( FollowerController::class, 'update' ),
				),
			),
			'settings'                         => array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'permission_callback' => array( $this, 'logged_in_and_can_access_route' ),
					'callback'            => array( SettingsController::class, 'get' ),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'permission_callback' => array( $this, 'logged_in_and_can_access_route' ),
					'callback'            => array( SettingsController::class, 'update' ),
				),
			),
			'am-plugins'                       => array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'permission_callback' => array( $this, 'logged_in_and_can_access_route' ),
					'callback'            => array( AMPluginsController::class, 'get' ),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'permission_callback' => array( $this, 'logged_in_and_can_access_route' ),
					'callback'            => array( AMPluginsController::class, 'update' ),
				),
			),
			'settings/send-test-email'         => array(
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'permission_callback' => array( $this, 'logged_in_and_can_access_route' ),
					'callback'            => array( SettingsController::class, 'send_test_email' ),
				),
			),
			'file'                             => array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'permission_callback' => array( $this, 'logged_in_and_can_access_route' ),
				'callback'            => array( UploadController::class, 'upload' ),
			),
			'dashboard'                        => array(
				'methods'             => \WP_REST_Server::READABLE,
				'permission_callback' => array( $this, 'logged_in_and_can_access_route' ),
				'callback'            => array( DashboardController::class, 'get' ),
			),
		);
	}

	/**
	 * Registers the REST API routes.
	 *
	 * Hook: rest_api_init
	 *
	 * @see https://developer.wordpress.org/reference/hooks/rest_api_init/
	 * @see https://developer.wordpress.org/reference/functions/register_rest_route/
	 * @see https://developer.wordpress.org/rest-api/extending-the-rest-api/routes-and-endpoints/
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function register_routes() {
		foreach ( $this->get_routes() as $route => $args ) {

			// Check if route is a single endpoint or an array of endpoints. A single-endpoint route would have the
			// callback key set directly. If single-endpoint, we add it to an array so we can parse it the same way
			// we parse an array of endpoint.
			if ( ! empty( $args['callback'] ) ) {
				$args = array( $args );
			}

			$that = $this;
			$args = array_map(
				function( $args ) use ( $that ) {
					return array_merge(
						$args,
						// By default, all routes have their callback set to fallback. This is a safety
						// measure in case the route resolver doesn't work.
						array(
							'callback' => array( $that, 'fallback' ),
						)
					);
				},
				$args
			);

			// If single-endpoint, let's use the one args.
			if ( 1 === count( $args ) ) {
				$args = $args[0];
			}

			register_rest_route(
				$this->namespace,
				$route,
				$args
			);
		}
	}

	/**
	 * Fallback method for invalid REST API routes.
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_Error A WP_Error object indicating that the route is invalid.
	 */
	public function fallback( $request ) {
		return new \WP_Error( 'rest_invalid_handler', __( 'Invalid route.', 'comment-notifications' ), array( 'status' => 500 ) );
	}

	/**
	 * Resolves the REST API route to a controller method.
	 *
	 * This filter replaces the default WordPress REST API dispatcher with our own.
	 *
	 * Hook: rest_dispatch_request
	 *
	 * @see https://developer.wordpress.org/reference/hooks/rest_dispatch_request/
	 *
	 * @since 0.9.1
	 *
	 * @param mixed            $result  The result of the REST API request.
	 * @param \WP_REST_Request $request The REST API request.
	 * @param string           $route   The REST API route.
	 * @param mixed            $handler The REST API handler.
	 *
	 * @return mixed The result of the REST API request.
	 */
	public function resolve_route( $result, $request, $route, $handler ) {
		$routes = $this->get_routes();

		// If the route doesn't match our namespace, return early with the $result so the WordPress's native dispatcher can take over.
		if ( strpos( $route, '/' . $this->namespace . '/' ) !== 0 ) {
			return $result;
		}

		$route = str_replace( '/' . $this->namespace . '/', '', $route );

		if ( ! isset( $routes[ $route ] ) ) {
			return new \WP_Error( 'rest_invalid_route', __( 'Invalid route.', 'comment-notifications' ), array( 'status' => 404 ) );
		}

		$route = $routes[ $route ];

		// Check if route is a single endpoint or an array of endpoints. A single-endpoint route would have the
		// callback key set directly. If multi-endpoint, we need to look for the right endpoint args using the
		// request method.
		if ( ! isset( $route['callback'] ) && ! empty( $route ) ) {
			$route = array_filter(
				$route,
				function( $args ) use ( $request ) {
					return false !== strpos( $args['methods'], $request->get_method() );
				}
			);

			$route = array_shift( $route );
		}

		if ( ! isset( $route['callback'] ) ) {
			return new \WP_Error( 'rest_invalid_handler', __( 'The handler for the route is invalid', 'comment-notifications' ), array( 'status' => 500 ) );
		}

		$callback = $route['callback'];

		if ( is_array( $callback ) ) {
			try {
				$controller = Plugin::get( $callback[0] );
				$method     = $callback[1];

				return $controller->$method( $request );
			} catch ( RestApiException $e ) {
				return $e->to_response();
			} catch ( \Exception $e ) {
				return RestApiException::unexpected_error( $e )->to_response();
			}
		}

		return $callback( $request );
	}

	/**
	 * Filters the list of request headers that are allowed for CORS requests.
	 *
	 * @since 0.9.1
	 *
	 * @param string[] $allow_headers The list of headers to allow.
	 *
	 * @return string[]
	 */
	public function set_allow_headers( $allow_headers ) {
		$allow_headers[] = 'X-CCVTR-Follower-Id';
		return $allow_headers;
	}

	/**
	 * Determines if the logged-in user can access the REST API route.
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return bool True if the user can access the route, false otherwise.
	 */
	public function logged_in_and_can_access_route( $request ) {
		return Utils::can_access( $request->get_route() );
	}

	/**
	 * Determines if the logged-in user can access the REST API route.
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return bool True if the user can access the route, false otherwise.
	 */
	public function logged_in_or_current_follower( $request ) {
		if ( $this->logged_in_and_can_access_route( $request ) ) {
			return true;
		}

		$followed_id = 0;

		$header_follower_id = $request->get_header( 'X-CCVTR-Follower-Id' );
		if ( ! empty( $header_follower_id ) ) {
			$followed_id = intval( $header_follower_id );
		} elseif ( $request->has_param( 'id' ) ) {
			$followed_id = intval( $request->get_param( 'id' ) );
		} elseif ( $request->has_param( 'follower_id' ) ) {
			$followed_id = intval( $request->get_param( 'follower_id' ) );
		}

		$curr_follower = $this->follower_control->get_current_follower();

		if ( $curr_follower && $curr_follower instanceof Follower && $curr_follower->id === $followed_id ) {
			return true;
		}

		return false;
	}
}
