<?php
/**
 * Comment Converter Upload Controller.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\RestApi\Controllers;

use CommentConverter\Plugin\Exceptions\RestApi\InvalidParamException;
use CommentConverter\Plugin\Exceptions\RestApi\RestApiException;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Upload Controller.
 *
 * @since 0.9.1
 */
class UploadController extends BaseController {

	/**
	 * Uploads a single file.
	 *
	 * Route: POST /v1/file
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_REST_Request $request The REST API request.
	 *
	 * @return \WP_REST_Response The REST API response.
	 *
	 * @throws InvalidParamException If a request parameter value is invalid.
	 * @throws RestApiException If something wrong happens.
	 */
	public function upload( \WP_REST_Request $request ) {
		try {
			$data = $request->get_file_params();

			if ( empty( $data['file'] ) ) {
				throw new InvalidParamException( esc_html__( 'Missing file parameter.', 'comment-notifications' ) );
			}

			$file = $data['file'];

			$allowed_mimes = array(
				'jpg|jpeg|jpe' => 'image/jpeg',
				'gif'          => 'image/gif',
				'png'          => 'image/png',
			);

			$file_info = wp_check_filetype( basename( $file['name'] ), $allowed_mimes );

			if ( empty( $file_info['type'] ) ) {
				throw new InvalidParamException( esc_html__( 'Invalid image file.', 'comment-notifications' ) );
			}

			// Validate image size.
			$max_size = 5 * MB_IN_BYTES;
			if ( $file['size'] > $max_size ) {
				throw new InvalidParamException( esc_html__( 'Image file size exceeds the maximum limit of 5MB.', 'comment-notifications' ) );
			}

			$path = $this->get_param( $request, 'path', 'key' );

			if ( empty( $path ) ) {
				throw new InvalidParamException( esc_html__( 'Missing path parameter.', 'comment-notifications' ) );
			}

			$upload_dir    = wp_upload_dir();
			$dir_full_path = $upload_dir['basedir'] . "/comment-converter/{$path}";

			wp_mkdir_p( $dir_full_path );
			if ( ! is_dir( $dir_full_path ) ) {
				throw new RestApiException( esc_html__( 'Upload directory could be be created. ', 'comment-notifications' ) );
			}

			// Disable the default form data check.
			$overrides = array( 'test_form' => false );
			$file_data = wp_handle_upload( $file, $overrides );

			if ( isset( $file_data['error'] ) ) {
				throw new RestApiException( esc_html__( 'File could not be uploaded.', 'comment-notifications' ) );
			}

			$url = $file_data['url'];
		} catch ( RestApiException $e ) {
			return $e->to_response();
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'url'     => $url,
			),
			200
		);
	}
}
