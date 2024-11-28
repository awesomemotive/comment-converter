<?php
/**
 * Comment Converter Invalid Token Exception.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Exceptions\TokenAuthentication;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Invalid Token Exception.
 *
 * @since 0.9.1
 */
class InvalidTokenException extends TokenAuthenticationException {

}
