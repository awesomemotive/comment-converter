<?php
/**
 * Comment Converter Admin Pages.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Admin;

use CommentConverter\Plugin\Settings\Options;
use CommentConverter\Plugin\Utils\Urls;
use CommentConverter\Plugin\Utils\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Admin Pages.
 *
 * @since 0.9.1
 */
class Pages {

	/**
	 * Holds the instance of Options.
	 *
	 * @since 0.9.1
	 *
	 * @var Options
	 */
	protected $options;

	/**
	 * Holds the array of page definitions.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected $pages;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Options     $options Instance of Options.
	 */
	public function __construct( Options $options ) {
		$this->options      = $options;
	}

	/**
	 * Sets up the hooks for the admin pages.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		// Add hook for the Admin menu pages.
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );

		// Add hook to hide hidden Admin menu pages.
		add_filter( 'submenu_file', array( $this, 'hide_hidden_admin_menu' ) );

		// Add hook for the general Admin styles.
		add_action( 'admin_footer', array( $this, 'enqueue_admin_css' ) );

		// Add hook for the Admin footer text.
		add_filter( 'admin_footer_text', array( $this, 'add_admin_footer_text' ) );
	}

	/**
	 * Adds the admin menu and pages.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function add_admin_menu() {
		$pages = $this->get_menu_pages();

		foreach ( $pages as $page ) {
			if ( empty( $page['parent_slug'] ) ) {
				$hook = add_menu_page(
					$page['title'],
					$page['menu'] ?? $page['title'],
					Utils::access_capability( $page['slug'] ),
					$page['slug'],
					$page['callback'],
					$page['icon'],
					$page['menu_position']
				);
			} else {
				$hook = add_submenu_page(
					$page['parent_slug'],
					$page['title'],
					$page['menu'] ?? $page['title'],
					Utils::access_capability( $page['slug'] ),
					$page['slug'],
					$page['callback']
				);
			}

			if ( ! empty( $page['redirect'] ) ) {
				// Handle the redirect when the page loads.
				add_action( 'load-' . $hook, array( $this, 'handle_redirect' ), 999 );
			} else {
				// Load the page assets when the page loads.
				add_action( 'load-' . $hook, array( $this, 'enqueue_admin_app_assets' ) );
			}
		}
	}

	/**
	 * Hides hidden Admin menu pages.
	 *
	 * By hidden, you should understand that the page is not shown in the menu but is still accessible via the URL.
	 *
	 * @since 0.9.1
	 *
	 * @param string $submenu_file The submenu file.
	 *
	 * @return string The updated submenu file.
	 */
	public function hide_hidden_admin_menu( $submenu_file ) {
		global $plugin_page;

		$page = $this->get_page_definition( $plugin_page );

		// Select another submenu item to highlight (optional).
		if ( $plugin_page && ! empty( $page['hidden'] ) && ! empty( $page['menu_highlight'] ) ) {
			$submenu_file = $page['menu_highlight'];
		}

		$hidden_pages = array_filter(
			$this->get_menu_pages(),
			function ( $page ) {
				return ! empty( $page['hidden'] );
			}
		);

		// Removes the hidden menus from the menu.
		foreach ( $hidden_pages as $hidden_page ) {
			remove_submenu_page( $hidden_page['parent_slug'], $hidden_page['slug'] );
		}

		return $submenu_file;
	}

	/**
	 * Enqueues the scripts and styles for the Comment Converter Admin App.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function enqueue_admin_app_assets() {
		$current_user = wp_get_current_user();
		$asset_file   = include Utils::dir_path( 'build/index.asset.php' );
		wp_enqueue_style( 'ccvtr-app-style', Utils::dir_url( 'build/style-index.css' ), array(), $asset_file['version'] );
		wp_register_script( 'ccvtr-app-script', Utils::dir_url( 'build/index.js' ), $asset_file['dependencies'], $asset_file['version'], true );
		$js_data = array(
			'adminBaseUrl'     => Urls::admin(),
			'assetsUrl'        => Utils::dir_url( 'assets/' ),
			'dropdownValues'   => $this->get_admin_app_dropdown_values(),
			'loggedInUserData' => array(
				'first_name' => sanitize_text_field( empty( $current_user->first_name ) ? $current_user->display_name : $current_user->first_name ),
				'last_name'  => sanitize_text_field( $current_user->last_name ),
				'email'      => sanitize_email( $current_user->user_email ),
				'domain'     => sanitize_text_field( site_url() ),
			),
		);
		wp_localize_script( 'ccvtr-app-script', 'ccData', $js_data );
		wp_set_script_translations( 'ccvtr-app-script', 'subscribe-to-comment-notifications-comment-converter', Utils::dir_path( 'languages' ) );
		wp_enqueue_script( 'ccvtr-app-script' );

		wp_enqueue_editor();
	}

	/**
	 * Enqueues the styles for the Admin pages.
	 *
	 * It includes general styles that are not restricted to the Comment Converter Admin pages like styles for menu items.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function enqueue_admin_css() {
		$asset_file = include Utils::dir_path( 'build/admin.asset.php' );
		wp_enqueue_style( 'ccvtr-admin-style', Utils::dir_url( 'build/admin.css' ), array(), $asset_file['version'] );
	}

	/**
	 * Returns an array of definitions for our admin pages.
	 *
	 * If we need more pages, add them to this array.
	 *
	 * @since 0.9.1
	 *
	 * @return array Array of page definitions.
	 */
	public function get_menu_pages() {
		if ( empty( $this->pages ) ) {

			// Filter to change the menu position if there is any conflict with another menu on the same position.
			$menu_position = apply_filters( 'comment_converter_menu_position', 27 );

			$main_page_slug = 'comment-converter-dashboard';

			$this->pages[ $main_page_slug ] = array(
				'slug'          => $main_page_slug,
				'title'         => 'Converter',
				'icon'          => $this->icon_svg(),
				'menu_position' => $menu_position,
				'callback'      => array( $this, 'render_admin_app' ),
			);

			$this->pages[] = array(
				'slug'        => $main_page_slug,
				'parent_slug' => $main_page_slug,
				'title'       => __( 'Dashboard', 'subscribe-to-comment-notifications-comment-converter' ),
				'callback'    => array( $this, 'render_admin_app' ),
			);

			$this->pages[] = array(
				'slug'           => 'comment-converter-getting-started',
				'parent_slug'    => $main_page_slug,
				// translators: Comment Converter is the name of the plugin.
				'title'          => __( 'Welcome to Comment Converter', 'subscribe-to-comment-notifications-comment-converter' ),
				'callback'       => array( $this, 'render_admin_app' ),
				'hidden'         => true, // This is a welcome page and as such should not be shown in the menu.
				'menu_highlight' => $main_page_slug,
			);

			$this->pages[] = array(
				'slug'        => 'comment-converter-followers',
				'parent_slug' => $main_page_slug,
				'title'       => __( 'Followers', 'subscribe-to-comment-notifications-comment-converter' ),
				'callback'    => array( $this, 'render_admin_app' ),
			);

			$this->pages[] = array(
				'slug'           => 'comment-converter-follower',
				'parent_slug'    => $main_page_slug,
				'title'          => __( 'Single Follower', 'subscribe-to-comment-notifications-comment-converter' ),
				'callback'       => array( $this, 'render_admin_app' ),
				'hidden'         => true, // This is a sub page and as such should not be shown in the menu.
				'menu_highlight' => 'comment-converter-followers',
			);

			$this->pages[] = array(
				'slug'        => 'comment-converter-comment-form',
				'parent_slug' => $main_page_slug,
				'title'       => __( 'Notifications', 'subscribe-to-comment-notifications-comment-converter' ),
				'callback'    => array( $this, 'render_admin_app' ),
			);

			$this->pages[] = array(
				'slug'           => 'comment-converter-emails',
				'parent_slug'    => $main_page_slug,
				'title'          => __( 'Notifications', 'subscribe-to-comment-notifications-comment-converter' ),
				'callback'       => array( $this, 'render_admin_app' ),
				'hidden'         => true, // This is a sub page and as such should not be shown in the menu.
				'menu_highlight' => 'comment-converter-comment-form',
			);

			/*
			$this->pages[] = array(
				'slug'        => 'comment-converter-integrations',
				'parent_slug' => $main_page_slug,
				'title'       => __( 'Integrations', 'subscribe-to-comment-notifications-comment-converter' ),
				'callback'    => array( $this, 'render_admin_app' ),
			);
			*/

			$this->pages[] = array(
				'slug'        => 'comment-converter-options',
				'parent_slug' => $main_page_slug,
				'title'       => __( 'Options', 'subscribe-to-comment-notifications-comment-converter' ),
				'callback'    => array( $this, 'render_admin_app' ),
			);

			$this->pages[] = array(
				'slug'        => 'comment-converter-about-us',
				'parent_slug' => $main_page_slug,
				'title'       => __( 'About Us', 'subscribe-to-comment-notifications-comment-converter' ),
				'callback'    => array( $this, 'render_admin_app' ),
			);

			// If user upgradeable, add an upgrade link to menu.
			if ( $this->can_show_upgrade() ) {
				$this->pages[] = array(
					'slug'        => 'comment-converter-upgrade',
					'parent_slug' => $main_page_slug,
					// TODO: replace Pro level slug and names here.
					'title'       => 'vbp_pro' === $this->options->get_level()
						? __( 'Upgrade to Growth', 'subscribe-to-comment-notifications-comment-converter' )
						: __( 'Upgrade to Pro', 'subscribe-to-comment-notifications-comment-converter' ),
					'redirect'    => esc_url_raw( Urls::upgrade( 'pluginmenu' ) ),
					'callback'    => '__return_null',
				);
			}
		}

		return $this->pages;
	}

	/**
	 * Returns a page definition by page slug.
	 *
	 * @since 0.9.1
	 *
	 * @param string $slug The page slug.
	 *
	 * @return array|null The found page definition or null.
	 */
	public function get_page_definition( $slug ) {
		$pages = $this->get_menu_pages();

		foreach ( $pages as $page ) {
			// Only considers sub pages as the dashboard and main menu page shares the same slug.
			if ( $slug === $page['slug'] && ! empty( $page['parent_slug'] ) ) {
				return $page;
			}
		}

		return null;
	}

	/**
	 * Get the Comment Converter SVG icon, and maybe encode it.
	 *
	 * @since 0.9.1
	 *
	 * @param string $fill Color of icon.
	 * @param bool   $return_encoded Whether the svg shoud be base_64 encoded.
	 *
	 * @return string SVG icon.
	 */
	public function icon_svg( $fill = '#a0a5aa', $return_encoded = true ) {
		$icon = Utils::get_contents( Utils::dir_path( '/assets/logos/comment-converter-single-path-logomark.svg' ) );
		$icon = str_replace( 'fill="currentColor"', 'fill="' . $fill . '"', $icon );

		if ( $return_encoded ) {
			$icon = 'data:image/svg+xml;base64,' . base64_encode( $icon ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		}

		return $icon;
	}

	/**
	 * Outputs the markup for the Comment Converter Admin App.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function render_admin_app() {
		// The $data['flat_logo'] variable is used in the admin-app.php file.
		$data['flat_logo'] = Utils::get_contents( Utils::dir_path( '/assets/logos/comment-converter-flat-logomark.svg' ) );

		require_once Utils::dir_path( 'views/admin-app.php' );
	}

	/**
	 * Handle redirect for registered page.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function handle_redirect() {
		global $plugin_page;

		// Defaults to dashboard.
		$url = Urls::dashboard();

		$page = $this->get_page_definition( $plugin_page );
		if ( ! empty( $page['redirect'] ) && is_string( $page['redirect'] ) ) {
			$url = $page['redirect'];
		}

		wp_safe_redirect( esc_url_raw( $url ) );
		exit;
	}

	/**
	 * Customizes the footer text on the OptinMonster settings page.
	 *
	 * @since 0.9.1
	 *
	 * @param string $text  The default admin footer text.
	 * @return string $text Amended admin footer text.
	 */
	public function add_admin_footer_text( $text ) {
		if ( ! Utils::is_cc_page() ) {
			return $text;
		}

		$url = 'https://wordpress.org/support/plugin/comment-converter/reviews?filter=5#new-post';

		/* translators: %1$s - Comment Converter plugin reviews url - Comment Converter is the name of the plugin. */
		$text = sprintf( __( 'Please rate <strong>Comment Converter</strong> <a class="stars" href="%1$s" target="_blank" rel="noopener">&#9733;&#9733;&#9733;&#9733;&#9733;</a> on <a href="%1$s" target="_blank" rel="noopener noreferrer">WordPress.org</a> to help us spread the word. Thank you from the Comment Converter team!', 'subscribe-to-comment-notifications-comment-converter' ), $url );

		return $text;
	}

	/**
	 * Check if the user can see upgrade prompts.
	 *
	 * @since 0.9.1
	 *
	 * @return boolean Whether upgrades can be shown.
	 */
	public function can_show_upgrade() {
		return $this->can_upgrade() || ! $this->options->get_level();
	}

	/**
	 * Check if the CC user's plan is upgradeable.
	 *
	 * @since 0.9.1
	 *
	 * @return boolean Whether CC user's plan is upgradeable.
	 */
	public function can_upgrade() {
		$level = $this->options->get_level();

		// TODO: Check if plan upgradeable... (e.g. not top tier). For now, always return true.
		return true;
	}

	/**
	 * Retrieves the values for the dropdowns in the Comment Converter Admin App.
	 *
	 * @since 0.9.1
	 *
	 * @return array An array containing the values for the dropdowns in the app.
	 */
	protected function get_admin_app_dropdown_values() {
		$post_type_args = array(
			'public'   => true,
			'_builtin' => false, // Exclude built-in post types like 'media' and 'attachment'.
		);

		// Exclude the ones we can't save meta fields to. Which we need to enable comment following on posts.
		$post_types = array_filter(
			get_post_types( $post_type_args, 'objects' ),
			function( $post_type ) {
				return post_type_supports( $post_type->name, 'custom-fields' );
			}
		);

		// Parse the post types to a dropdown format.
		$post_types = array_values(
			array_map(
				function( $post_type ) {
					return array(
						'label' => $post_type->label,
						'value' => $post_type->name,
					);
				},
				$post_types
			)
		);

		$default_post_types = array(
			array(
				'label' => 'Posts',
				'value' => 'post',
			),
			array(
				'label' => 'Pages',
				'value' => 'page',
			),
		);

		// Add the default post types.
		$post_types = array_merge( $default_post_types, $post_types );

		return array(
			'post_types' => $post_types,
		);
	}
}
