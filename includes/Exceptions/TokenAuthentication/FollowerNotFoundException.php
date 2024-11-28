<?php
/**
 * Comment Converter Follower Not Found Exception.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Exceptions\TokenAuthentication;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follower Not Found Exception.
 *
 * @since 0.9.1
 */
class FollowerNotFoundException extends TokenAuthenticationException {

}
