<?php
/**
 * Comment Converter Expired Token Exception.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Exceptions\TokenAuthentication;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Expired Token Exception.
 *
 * @since 0.9.1
 */
class ExpiredTokenException extends TokenAuthenticationException {

}
