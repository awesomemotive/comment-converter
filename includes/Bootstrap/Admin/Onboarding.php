<?php
/**
 * Comment Converter Onboarding.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Admin;

use CommentConverter\Plugin\Utils\Urls;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Onboarding.
 *
 * @since 0.9.1
 */
class Onboarding {
	/**
	 * The transient key for the onboarding.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	const TRANSIENT_KEY = 'ccvtr_onboarding_redirect';

	/**
	 * Sets up the hooks for the onboarding.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		// Add hook for Onboarding screen redirect.
		add_action( 'admin_init', array( $this, 'handle_onboarding_redirect' ), 9999 );
	}

	/**
	 * Handles the onboarding redirect.
	 *
	 * This function checks if a new install has just occurred. If so,
	 * then we redirect the user to the appropriate page.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function handle_onboarding_redirect() {

		// Check if we should consider redirection.
		if ( ! get_transient( self::TRANSIENT_KEY ) ) {
			return;
		}

		// If we are redirecting, clear the transient so it only happens once.
		delete_transient( self::TRANSIENT_KEY );

		// Abort so we only set the transient for single site installs.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['activate-multi'] ) || is_network_admin() ) {
			return;
		}

		// Initial install.
		wp_safe_redirect( Urls::internal_admin( 'getting-started' ) );
		exit;
	}
}
