<?php
/**
 * Comment Converter Container Exception.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Exceptions\Container;

use CommentConverter\Plugin\Exceptions\Exception;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Container Exception.
 *
 * Altought not explicit yet, this class intends to implement the PSR-11 ContainerExceptionInterface.
 *
 * @see https://www.php-fig.org/psr/psr-11/
 *
 * @since 0.9.1
 */
class ContainerException extends Exception {

}
