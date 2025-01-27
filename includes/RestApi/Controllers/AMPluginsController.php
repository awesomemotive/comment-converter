<?php
/**
 * Comment Converter AM Plugins Controller.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\RestApi\Controllers;

use CommentConverter\Plugin\Exceptions\PluginInstallationException;
use CommentConverter\Plugin\Exceptions\RestApi\AuthorizationException;
use CommentConverter\Plugin\Exceptions\RestApi\InvalidParamException;
use CommentConverter\Plugin\Exceptions\RestApi\RestApiException;
use CommentConverter\Plugin\Utils\AMPlugins;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter AM Plugins Controller.
 *
 * @since 0.9.1
 */
class AMPluginsController extends BaseController {

	/**
	 * Holds the instance of AMPlugins.
	 *
	 * @since 0.9.1
	 *
	 * @var AMPlugins The instance of AMPlugins.
	 */
	protected AMPlugins $am_plugins;

	/**
	 * Constructs a new AMPluginsController object.
	 *
	 * @since 0.9.1
	 *
	 * @param AMPlugins $am_plugins The instance of AMPlugins.
	 */
	public function __construct( AMPlugins $am_plugins ) {
		$this->am_plugins = $am_plugins;
	}

	/**
	 * Retrieves the list of AM plugins with their status.
	 *
	 * Route: /v1/am-plugins
	 *
	 * @since 0.9.1
	 *
	 * @return \WP_REST_Response The REST API response.
	 */
	public function get() {
		$data = $this->am_plugins->get_list_with_status();

		$action_nonce = wp_create_nonce( 'ccvtr_am_plugin_action_nonce' );
		foreach ( $data as $plugin_id => $plugin ) {
			$data[ $plugin_id ]['actionNonce'] = $action_nonce;
		}

		return new \WP_REST_Response( array_values( $data ), 200 );
	}

	/**
	 * Handles installing and/or activating an AM plugin.
	 *
	 * Route: POST /v1/am-plugins
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 *
	 * @throws InvalidParamException If a request parameter value is invalid.
	 * @throws AuthorizationException If the request is not authorized.
	 */
	public function update( \WP_REST_Request $request ) {
		try {
			$nonce = $this->get_param( $request, 'actionNonce', 'string' );

			// Check the nonce.
			if ( empty( $nonce ) || ! wp_verify_nonce( $nonce, 'ccvtr_am_plugin_action_nonce' ) ) {
				throw new AuthorizationException( esc_html__( 'Security token invalid!', 'subscribe-to-comment-notifications-comment-converter' ) );
			}

			$id = $this->get_param( $request, 'id', 'string' );
			if ( empty( $id ) ) {
				throw new InvalidParamException( esc_html__( 'Plugin Id required.', 'subscribe-to-comment-notifications-comment-converter' ) );
			}

			$plugin = $this->am_plugins->get( $id );

			if ( empty( $plugin['installed'] ) ) {
				if ( empty( $plugin['url'] ) ) {
					throw new InvalidParamException( esc_html__( 'Plugin install URL required.', 'subscribe-to-comment-notifications-comment-converter' ) );
				}

				return new \WP_REST_Response( $this->am_plugins->install_plugin( $plugin ), 200 );
			}

			$which = 'default' === $plugin['which'] ? $id : $plugin['which'];

			return new \WP_REST_Response( $this->am_plugins->activate_plugin( $which ), 200 );
		} catch ( RestApiException $e ) {
			return $e->to_response();
		} catch ( PluginInstallationException $e ) {
			return RestApiException::from_exception( $e )->to_response();
		} catch ( \Exception $e ) {
			return RestApiException::unexpected_error( $e )->to_response();
		}
	}
}
