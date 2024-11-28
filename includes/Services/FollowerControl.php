<?php
/**
 * Comment Converter Follower Control.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Services;

use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Database\Repositories\FollowerRepository;
use CommentConverter\Plugin\Exceptions\TokenAuthentication\ExpiredTokenException;
use CommentConverter\Plugin\Exceptions\TokenAuthentication\FollowerNotFoundException;
use CommentConverter\Plugin\Exceptions\TokenAuthentication\InvalidTokenException;
use CommentConverter\Plugin\Exceptions\TokenAuthentication\TokenAuthenticationException;
use CommentConverter\Plugin\Utils\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follower Control.
 *
 * @since 0.9.1
 */
class FollowerControl {

	/**
	 * The name of the follower cookie.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	const FOLLOWER_COOKIE = 'ccvtr_follower_' . COOKIEHASH;

	/**
	 * Cache the instance of the current follower.
	 *
	 * @since 0.9.1
	 *
	 * @var Follower|array|null
	 */
	protected $current_follower;

	/**
	 * Cache the generated tokens per follower.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected $token_cache = array();

	/**
	 * Holds the instance of FollowerRepository.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowerRepository
	 */
	protected $follower_repository;

		/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param FollowerRepository $follower_repository Instance of FollowerRepository.
	 */
	public function __construct( FollowerRepository $follower_repository ) {
		$this->follower_repository = $follower_repository;
	}

	/**
	 * Generates a follower token.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower $follower The follower object.
	 * @param int|null $expiration The expiration time of the token.
	 *
	 * @return string Returns the follower token.
	 */
	public function generate_follower_token( Follower $follower, $expiration = null ) {
		$unique_key = $follower->unique_key;

		// Include the expiration in the cache key.
		$cache_key = "$unique_key|$expiration";

		// If the token is already cached, return it.
		if ( ! empty( $this->token_cache[ $cache_key ] ) ) {
			return $this->token_cache[ $cache_key ];
		}

		$expiration = $expiration ?? time() + ( MONTH_IN_SECONDS );

		$hash = $this->get_follower_hash( $follower, $expiration );

		return "$unique_key|$expiration|$hash";
	}

	/**
	 * Retrieves a follower from a token.
	 *
	 * @since 0.9.1
	 *
	 * @param string $token The follower token.
	 *
	 * @return Follower Returns the follower object.
	 *
	 * @throws InvalidTokenException If the token is invalid.
	 * @throws ExpiredTokenException If the token has expired.
	 * @throws FollowerNotFoundException If the follower is not found.
	 */
	public function get_follower_from_token( $token ) {
		$token_parts = explode( '|', $token );

		if ( 3 !== count( $token_parts ) ) {
			throw new InvalidTokenException();
		}

		$unique_key = $token_parts[0];
		$expiration = $token_parts[1];
		$hash       = $token_parts[2];

		if ( $expiration < time() ) {
			throw new ExpiredTokenException();
		}

		$follower = $this->follower_repository->get_by_unique_key( $unique_key );

		if ( empty( $follower ) ) {
			throw new FollowerNotFoundException();
		}

		$expected_hash = $this->get_follower_hash( $follower, $expiration );

		if ( $expected_hash !== $hash ) {
			throw new InvalidTokenException();
		}

		return $follower;
	}

	/**
	 * Generates a hash for a follower.
	 *
	 * The hash is part of the follower token.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower $follower The follower object.
	 * @param int      $expiration The expiration time of the token.
	 *
	 * @return string Returns the hash.
	 */
	protected function get_follower_hash( Follower $follower, $expiration ) {
		$unique_key = $follower->unique_key;
		$email      = $follower->notification_email;
		$salt       = $follower->salt;

		return md5( $unique_key . '|' . $email . '|' . $expiration . '|' . $salt );
	}

	/**
	 * Creates the follower cookie to identify a follower.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower $follower The follower object.
	 */
	public function create_follower_cookie( Follower $follower ) {
		$token = $this->generate_follower_token( $follower );

		Utils::set_cookie( self::FOLLOWER_COOKIE, $token, time() + DAY_IN_SECONDS );
	}

	/**
	 * Unsets the follower cookie.
	 *
	 * @since 0.9.1
	 */
	public function unset_follower_cookie() {
		Utils::unset_cookie( self::FOLLOWER_COOKIE );
	}

	/**
	 * Gets the current follower.
	 *
	 * The current follower is identified by TBD.
	 *
	 * @since 0.9.1
	 *
	 * @return mixed Returns the current follower.
	 */
	public function get_current_follower() {
		if ( ! empty( $this->current_follower ) ) {
			return $this->current_follower;
		}

		$follower = null;

		if ( is_user_logged_in() ) {
			$current_user = wp_get_current_user();

			$follower = $this->follower_repository->get_by_user_id( $current_user->ID );

			if ( empty( $follower ) ) {
				$follower = $this->follower_repository->get_by_email( $current_user->user_email );

				if ( ! empty( $follower ) && empty( $follower->user_id ) ) {
					// If we found a follower record for an existing user, let's tie them together.
					$follower = $this->follower_repository->update(
						$follower,
						array(
							'user_id' => $current_user->ID,
						)
					);
				}
			}

			if ( empty( $follower ) ) {
				$follower = array(
					'email' => $current_user->user_email,
					'name'  => $current_user->display_name,
				);
			}
		} elseif ( ! empty( $_COOKIE[ self::FOLLOWER_COOKIE ] ) ) {
			try {
				$follower_cookie = sanitize_text_field( wp_unslash( $_COOKIE[ self::FOLLOWER_COOKIE ] ) );
				$follower        = $this->get_follower_from_token( $follower_cookie );
			} catch ( TokenAuthenticationException $e ) {
				// If the cookie exists, but it's not valid, let's unset it.
				$this->unset_follower_cookie();
			}
		}

		$this->current_follower = $follower;

		return $this->current_follower;
	}

}
