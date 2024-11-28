<?php
/**
 * Comment Converter Rest API Authorization Exception.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Exceptions\RestApi;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Rest API Authorization Exception.
 *
 * @since 0.9.1
 */
class AuthorizationException extends RestApiException {
	/**
	 * The default error code.
	 *
	 * @since 0.9.1
	 *
	 * @var int
	 */
	public $default_code = 401;

	/**
	 * Get default error code.
	 *
	 * @since 0.9.1
	 *
	 * @return int The default error code.
	 */
	public function get_default_code() {
		return rest_authorization_required_code();
	}
}
