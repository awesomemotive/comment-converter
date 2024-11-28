<?php
/**
 * Comment Converter Rest API Invalid Param Exception.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Exceptions\RestApi;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Rest API Invalid Param Exception.
 *
 * @since 0.9.1
 */
class InvalidParamException extends RestApiException {
	/**
	 * The default error code.
	 *
	 * @since 0.9.1
	 *
	 * @var int
	 */
	public $default_code = 400;
}
