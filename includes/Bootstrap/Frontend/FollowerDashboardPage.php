<?php
/**
 * Comment Converter Follower Dashboard Page.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Frontend;

use CommentConverter\Plugin\Services\FollowControl;
use CommentConverter\Plugin\Services\FollowerControl;
use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Exceptions\TokenAuthentication\TokenAuthenticationException;
use CommentConverter\Plugin\Exceptions\UserFacingException;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follower Dashboard Page.
 *
 * @since 0.9.1
 */
class FollowerDashboardPage {

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Holds the instance of FollowControl.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowControl
	 */
	protected $follow_control;

	/**
	 * Holds the instance of FollowerControl.
	 *
	 * @since 0.9.1
	 *
	 * @var FollowerControl
	 */
	protected $follower_control;

	/**
	 * Holds the page args.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected $args = array();

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Settings        $settings Instance of Settings.
	 * @param FollowControl   $follow_control Instance of FollowControl.
	 * @param FollowerControl $follower_control Instance of FollowerControl.
	 */
	public function __construct( Settings $settings, FollowControl $follow_control, FollowerControl $follower_control ) {
		$this->settings         = $settings;
		$this->follow_control   = $follow_control;
		$this->follower_control = $follower_control;

		// Set the default args.
		$this->set_page_args();
	}

	/**
	 * Sets the page arguments.
	 *
	 * @since 0.9.1
	 *
	 * @param array $page_args The page arguments to set. Default is an empty array.
	 *
	 * @return self Returns the instance of the class to support chaining.
	 */
	public function set_page_args( $page_args = array() ) {
		$this->args = wp_parse_args(
			$page_args,
			array(
				'page_path'  => $this->settings->get_follower_dashboard_page_path(),
				'page_title' => __( 'Follower Dashboard', 'comment-notifications' ),
			)
		);

		return $this;
	}

	/**
	 * Sets up the hooks.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {

		// Load the Follower Dashboard page on the right URL.
		add_action( 'template_redirect', array( $this, 'maybe_load_page' ) );

		// Disable canonical redirection for the Follower Dashboard page.
		add_filter( 'redirect_canonical', array( $this, 'disable_canonical_redirection' ), 10, 2 );
	}

	/**
	 * Checks if the current page is the Follower Dashboard page.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the current page is the Follower Dashboard page, false otherwise.
	 */
	protected function is_follower_dashboard_page() {
		$ccvtr_page = get_query_var( 'ccvtr_page' );

		if ( empty( $ccvtr_page ) || 'follower-dashboard' !== $ccvtr_page ) {
			return array( false, null );
		}

		$ccvtr_page_action = get_query_var( 'ccvtr_page_action' );

		if ( ! empty( $ccvtr_page_action ) && ! in_array( $ccvtr_page_action, array( 'confirm', 'unsubscribe' ), true ) ) {
			return array( false, null );
		}

		return array( true, $ccvtr_page_action );
	}

	/**
	 * Maybe load the Follower Dashboard page if on the right URL.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function maybe_load_page() {
		list( $is_page, $action ) = $this->is_follower_dashboard_page();

		if ( ! $is_page ) {
			return;
		}

		// Prevent the Follower Dashboard page from being indexed and followed by search engines.
		add_filter( 'wp_robots', array( $this, 'add_nofollow_noindex' ), 9999 );

		// Process the action before loading the page.
		$page_args = $this->process_action( $action );

		$this->set_page_args( $page_args );

		$output = $this->load_page();

		$this->reset_post(
			array(
				'ID'           => 0,
				'post_title'   => $this->args['page_title'],
				'post_name'    => 'ccvtr-follower-dashboard',
				'post_content' => $output,
				'is_page'      => true,
				'is_single'    => true,
			)
		);
	}

	/**
	 * Loads the Follower Dashboard page content and assets.
	 *
	 * @since 0.9.1
	 *
	 * @return string The page content.
	 */
	public function load_page() {

		// If the follower ID is not set, try to get it from the current follower.
		if ( empty( $this->args['error'] ) && empty( $this->args['follower_id'] ) ) {
			try {
				$curr_follower = $this->follower_control->get_current_follower();

				if ( $curr_follower && $curr_follower instanceof Follower ) {
					$this->args['follower_id'] = $curr_follower->id;
				}
			} catch ( TokenAuthenticationException $e ) {
				$this->args['error'] = __( 'Follower not found.', 'comment-notifications' );
			}
		}

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_page_assets' ) );

		return $this->get_page_content();
	}

	/**
	 * Gets the page content.
	 *
	 * @since 0.9.1
	 *
	 * @return string The page content.
	 */
	public function get_page_content() {
		// The $data['flat_logo'] variable is used in the admin-app.php file.
		$data['flat_logo'] = Utils::get_contents( Utils::dir_path( '/assets/logos/comment-converter-flat-logomark.svg' ) );

		$content = Utils::get_html( 'views/admin-app.php', $data );

		return $content;
	}

	/**
	 * Enqueues the scripts and styles for the Follower Dashboard App.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function enqueue_page_assets() {
		$asset_file = include Utils::dir_path( 'build/follower-dashboard.asset.php' );
		wp_enqueue_style( 'ccvtr-follower-dashboard-style', Utils::dir_url( 'build/style-follower-dashboard.css' ), array(), $asset_file['version'] );
		wp_register_script( 'ccvtr-follower-dashboard-script', Utils::dir_url( 'build/follower-dashboard.js' ), $asset_file['dependencies'], $asset_file['version'], true );
		$js_data = array(
			'assetsUrl'                 => Utils::dir_url( 'assets/' ),
			'followerId'                => $this->args['follower_id'] ?? null,
			'followerDashboardBasePath' => $this->args['page_path'],
			'error'                     => $this->args['error'] ?? null,
			'isDoubleOptInEnabled'      => $this->settings->is_double_optin_enabled(),
		);
		wp_localize_script( 'ccvtr-follower-dashboard-script', 'ccData', $js_data );
		wp_set_script_translations( 'ccvtr-follower-dashboard-script', 'comment-notifications', Utils::dir_path( 'languages' ) );
		wp_enqueue_script( 'ccvtr-follower-dashboard-script' );
		wp_enqueue_style( 'dashicons' );
	}

	/**
	 * Modifies the robots meta tag values to add 'nofollow' and 'noindex'.
	 *
	 * @since 0.9.1
	 *
	 * @param array $robots The existing robots meta tag values.
	 *
	 * @return array The modified robots meta tag values with 'nofollow' and 'noindex' set to true.
	 */
	public function add_nofollow_noindex( $robots ) {
		$robots['noindex']  = true;
		$robots['nofollow'] = true;
		return $robots;
	}

	/**
	 * Disables canonical redirection.
	 *
	 * @since 0.9.1
	 *
	 * @param string $redirect_url The original redirect URL.
	 * @param string $requested_url The requested URL.
	 *
	 * @return string|bool The updated redirect URL, or false to disable redirection.
	 */
	public function disable_canonical_redirection( $redirect_url, $requested_url ) {
		if ( strpos( $requested_url, $this->args['page_path'] ) !== false ) {
			return false;
		}

		return $requested_url;
	}

	/**
	 * Processes the action to take based on the request.
	 *
	 * @since 0.9.1
	 *
	 * @param string $action The action to process.
	 *
	 * @return array The page args to output in response to the action.
	 */
	protected function process_action( $action ) {
		switch ( $action ) {
			case 'confirm':
			case 'unsubscribe':
				$page_args = $this->process_follow_action( $action );
				break;
			default:
				$page_args = $this->process_index_action();
				break;
		}

		return $page_args;
	}

	/**
	 * Processes the follow action.
	 *
	 * The follow action is responsible for confirming or unsubscribing a follow.
	 *
	 * @since 0.9.1
	 *
	 * @param string $action The action to handle.
	 *
	 * @return array The page args to output.
	 *
	 * @throws UserFacingException If an error occurs.
	 */
	protected function process_follow_action( $action ) {
		$page_args = array(
			'page'  => $action,
			'error' => null,
		);

		try {

			// Disabling nonce verification because the Follower Dashboard page
			// 1. It's not a form submission;
			// 2. It's link that can be generated by the admin (and not the actual follower user that could be using the link);
			// 3. The link is sent to the follower by email that could be opened in another device, so the nonce would be invalid;
			// 4. The token should already be a secure way to authenticate the follower.
			// phpcs:disable WordPress.Security.NonceVerification.Recommended
			if ( empty( $_GET['ccvtk'] ) || empty( $_GET['ccvfi'] ) ) {
				throw new UserFacingException( __( 'Invalid link. Missing required information.', 'comment-notifications' ) );
			}

			$follow_id = absint( $_GET['ccvfi'] );
			// phpcs:enable WordPress.Security.NonceVerification.Recommended

			if ( 0 > $follow_id ) {
				throw new UserFacingException( __( 'Invalid subscription.', 'comment-notifications' ) );
			}

			$follow = $this->follow_control->get_follow_by_id( $follow_id );

			if ( empty( $follow ) ) {
				throw new UserFacingException( __( 'Subscription not found.', 'comment-notifications' ) );
			}

			$follower = $this->parse_token();

			if ( ! $follower || is_wp_error( $follower ) ) {
				throw new UserFacingException( __( 'Invalid link. Authentication failure.', 'comment-notifications' ) );
			}

			if ( (int) $follow->follower_id !== (int) $follower->id ) {
				throw new UserFacingException( __( 'Invalid link. Authorization failure.', 'comment-notifications' ) );
			}

			switch ( $action ) {
				case 'confirm':
					$this->follow_control->confirm_follow( $follow_id );

					if ( ! $follower->is_verified() ) {
						$follower->is_verified = true;
						$follower->save();
					}
					break;
				case 'unsubscribe':
					$this->follow_control->unsubscribe_follow( $follow_id );
					break;
			}

			$page_args['follow']      = $follow->to_array();
			$page_args['follower_id'] = $follower->id;
		} catch ( UserFacingException $e ) {
			$page_args['error'] = $e->getMessage();
		} catch ( \Exception $e ) {
			$page_args['error'] = __( 'An expected error occurred. Please try again. If the issue persists, kindly contact the site administrator for further assistance.', 'comment-notifications' );
		}

		return $page_args;
	}

	/**
	 * Processes the index action.
	 *
	 * The index action is responsible for processing the token to authenticate the follower before showing the Follower Dashboard page.
	 *
	 * @since 0.9.1
	 *
	 * @return array The page args for the Follower Dashboard page.
	 *
	 * @throws UserFacingException If an error occurs.
	 */
	protected function process_index_action() {
		$page_args = array(
			'page'        => 'follower-dashboard',
			'error'       => null,
			'follower_id' => null,
		);

		try {
			$follower = $this->parse_token();

			if ( is_wp_error( $follower ) ) {
				throw new UserFacingException( __( 'Invalid link. Authentication failure.', 'comment-notifications' ) );
			}

			if ( $follower ) {
				$page_args['follower_id'] = $follower->id;
			}
		} catch ( UserFacingException $e ) {
			$page_args['error'] = $e->getMessage();
		} catch ( \Exception $e ) {
			$page_args['error'] = __( 'An expected error occurred. Please try again. If the issue persists, kindly contact the site administrator for further assistance.', 'comment-notifications' );
		}

		return $page_args;
	}

	/**
	 * Parses the token from the GET parameters and validates it.
	 *
	 * @since 0.9.1
	 *
	 * @return Follower|\WP_Error|false Returns the authenticated follower if the token is valid, an error if the authentication fail, or false if there was no token to parse.
	 */
	protected function parse_token() {
		$token = get_query_var( 'ccvtk' );

		// If the token is set, we'll use it to authenticate the user.
		if ( empty( $token ) ) {
			return false;
		}

		$token = sanitize_text_field( wp_unslash( $token ) );

		try {
			$follower = $this->follower_control->get_follower_from_token( $token );
			$this->follower_control->create_follower_cookie( $follower );
			return $follower;
		} catch ( TokenAuthenticationException $e ) {
			return new \WP_Error( 'invalid_token', $e->getMessage() );
		}
	}

	/**
	 * Resets the global $post and $wp_query objects with virtual post data.
	 *
	 * This is used to display the Follower Dashboard page without creating a new page in the database.
	 *
	 * @since 0.9.1
	 *
	 * @param array $args The attributes for the new WP_Post object. Any missing attributes are filled with default values.
	 *
	 * @return void
	 */
	protected function reset_post( $args ) {
		global $wp_query, $post;

		// Use primarily empty attributes.
		$dummy = wp_parse_args(
			$args,
			array(
				'ID'                    => -9999,
				'post_status'           => 'publish',
				'post_author'           => 0,
				'post_parent'           => 0,
				'post_type'             => 'page',
				'post_date'             => '0000-00-00 00:00:00',
				'post_date_gmt'         => '0000-00-00 00:00:00',
				'post_modified'         => '0000-00-00 00:00:00',
				'post_modified_gmt'     => '0000-00-00 00:00:00',
				'post_content'          => '',
				'post_title'            => '',
				'post_excerpt'          => '',
				'post_content_filtered' => '',
				'post_mime_type'        => '',
				'post_password'         => '',
				'post_name'             => '',
				'guid'                  => '',
				'menu_order'            => 0,
				'pinged'                => '',
				'to_ping'               => '',
				'ping_status'           => '',
				'comment_status'        => 'closed',
				'comment_count'         => 0,
				'filter'                => 'raw',

				'is_404'                => false,
				'is_page'               => false,
				'is_single'             => false,
				'is_archive'            => false,
				'is_tax'                => false,
				'is_home'               => false,
			)
		);

		// Set the $post global.
		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		$post = new \WP_Post( (object) $dummy );

		// Copy the new post global into the main $wp_query.
		$wp_query->post  = $post;
		$wp_query->posts = array( $post );

		// Prevent comments form from appearing.
		$wp_query->post_count  = 1;
		$wp_query->is_404      = $dummy['is_404'];
		$wp_query->is_page     = $dummy['is_page'];
		$wp_query->is_single   = $dummy['is_single'];
		$wp_query->is_archive  = $dummy['is_archive'];
		$wp_query->is_tax      = $dummy['is_tax'];
		$wp_query->is_home     = $dummy['is_home'];
		$wp_query->is_singular = $wp_query->is_single;

		// If we are faking the post/page, we don't need the 'Edit' post link.
		add_filter( 'get_edit_post_link', '__return_false' );
	}
}
