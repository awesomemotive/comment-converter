<?php
/**
 * Comment Converter Token Authentication Exception.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Exceptions\TokenAuthentication;

use CommentConverter\Plugin\Exceptions\Exception;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Token Authentication Exception.
 *
 * @since 0.9.1
 */
abstract class TokenAuthenticationException extends Exception {

}
