<?php
/**
 * Comment Converter Variable Replacer.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Utils;

use CommentConverter\Plugin\Services\FollowControl;
use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Database\Models\Follow;
use CommentConverter\Plugin\Utils\Urls;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Variable Replacer.
 *
 * @since 0.9.1
 */
class VariableReplacer {

	/**
	 * Holds the instance of FollowControl.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowControl
	 */
	protected $follow_control;

	/**
	 * Holds the instance of Follow.
	 *
	 * @since 0.9.1
	 *
	 * @var Follow
	 */
	protected $follow;

	/**
	 * Holds the instance of Follower.
	 *
	 * @since 0.9.1
	 *
	 * @var Follower
	 */
	protected $follower;

	/**
	 * Holds the instance of WP_Post.
	 *
	 * @since 0.9.1
	 *
	 * @var \WP_Post
	 */
	protected $post;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param FollowControl $follow_control Instance of FollowControl.
	 */
	public function __construct( FollowControl $follow_control ) {
		$this->follow_control = $follow_control;
	}

	/**
	 * Replace vars in a string.
	 *
	 * @since 0.9.1
	 *
	 * @param string $string String to have variables replaced.
	 *
	 * @return string The final string with all variables replaced.
	 */
	public function replace( $string ) {
		// Define a regular expression pattern to match variables inside brackets.
		$pattern = '/\[([^\]]+)\]/';

		// Use the preg_match_all function to find all matches in the string.
		preg_match_all( $pattern, $string, $matches );

		if ( empty( $matches ) || empty( $matches[0] ) ) {
			return $string;
		}

		// Remove duplicates.
		$variables = array_unique( $matches[0] );

		$original_string = $string;

		foreach ( $variables as $variable ) {
			try {
				$replacement = null;

				switch ( $variable ) {
					case '[Post_Title]':
						$replacement = $this->get_post()->post_title;
						break;
					case '[Confirm_Url]':
						$replacement = Urls::get_follow_confirmation_url( $this->get_follow() );
						break;
					case '[Manage_Subscriptions_Url]':
						$replacement = Urls::get_follower_dashboard_authenticated_url( $this->get_follower() );
						break;
					case '[Unsubscribe_Url]':
						$replacement = Urls::get_follow_unsubscription_url( $this->get_follow() );
						break;
					case '[Post_Url]':
						$replacement = get_permalink( $this->get_post() );
						break;
					default:
						break;
				}

				if ( null !== $replacement ) {
					$string = str_replace( $variable, $replacement, $string );
				}
			} catch ( \Exception $e ) {
				// Do nothing. The variable would just not be replaced.
				error_log( sprintf( 'Comment Converter. Error replacing variable on string "%s". Error: %s ', $original_string, $e->getMessage() ) );
			}
		}

		return $string;
	}

	/**
	 * Set the instance of Follow.
	 *
	 * @since 0.9.1
	 *
	 * @param Follow $follow Instance of Follow.
	 *
	 * @return self
	 */
	public function set_follow( Follow $follow ) {
		$this->follow = $follow;

		return $this;
	}

	/**
	 * Get the instance of Follow.
	 *
	 * @since 0.9.1
	 *
	 * @return Follow Instance of Follow.
	 *
	 * @throws \Exception If the instance of Follow is not set.
	 */
	public function get_follow() {
		if ( ! isset( $this->follow ) ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- The exceptions are not meant to be outputted as HTML.
			throw new \Exception( __( 'Follow not set.', 'comment-notifications' ) );
		}

		return $this->follow;
	}

	/**
	 * Set the instance of WP_post.
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_post $post Instance of WP_post.
	 *
	 * @return self
	 */
	public function set_post( \WP_post $post ) {
		$this->post = $post;

		return $this;
	}

	/**
	 * Get the instance of WP_post.
	 *
	 * @since 0.9.1
	 *
	 * @return WP_post Instance of WP_post.
	 *
	 * @throws \Exception If the instance of WP_post is not set.
	 */
	public function get_post() {
		if ( isset( $this->post ) ) {
			return $this->post;
		}

		if ( isset( $this->follow ) ) {
			return $this->follow->post;
		}

		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- The exceptions are not meant to be outputted as HTML.
		throw new \Exception( __( 'Post not set.', 'comment-notifications' ) );
	}

	/**
	 * Set the instance of Follower.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower $follower Instance of Follower.
	 *
	 * @return self
	 */
	public function set_follower( Follower $follower ) {
		$this->follower = $follower;

		return $this;
	}

	/**
	 * Get the instance of Follower.
	 *
	 * @since 0.9.1
	 *
	 * @return Follower Instance of Follower.
	 *
	 * @throws \Exception If the instance of Follower is not set.
	 */
	public function get_follower() {
		if ( isset( $this->follower ) ) {
			return $this->follower;
		}

		if ( isset( $this->follow ) ) {
			return $this->follow->follower;
		}

		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- The exceptions are not meant to be outputted as HTML.
		throw new \Exception( __( 'Follower not set.', 'comment-notifications' ) );
	}
}
