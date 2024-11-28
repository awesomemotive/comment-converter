<?php
/**
 * Comment Converter Rewrite Rules.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Backend;

use CommentConverter\Plugin\Settings\Settings;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Rewrite Rules.
 *
 * @since 0.9.1
 */
class RewriteRules {

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Settings $settings Instance of Settings.
	 */
	public function __construct( Settings $settings ) {
		$this->settings = $settings;
	}

	/**
	 * Sets up the hooks.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		// Register the query vars.
		add_filter( 'query_vars', array( $this, 'add_query_vars' ) );

		// Register the rewrite rules.
		$this->add_rewrite_rules();
	}

	/**
	 * Adds rewrite rules for the Follower Dashboard page.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function add_rewrite_rules() {
		$page_path = $this->settings->get_follower_dashboard_page_path();

		add_rewrite_rule( '^' . $page_path . '(?:\/(.+))?', 'index.php?ccvtr_page=follower-dashboard&ccvtr_page_action=$matches[1]', 'top' );
	}

	/**
	 * Adds query variables for the Comment Converter page.
	 *
	 * @since 0.9.1
	 *
	 * @param array $query_vars The original array of public query variables.
	 *
	 * @return array The updated array of public query variables.
	 */
	public function add_query_vars( $query_vars ) {
		$query_vars[] = 'ccvtr_page'; // Identifies the Comment Converter page.
		$query_vars[] = 'ccvtr_page_action'; // Identifies the URL action.
		$query_vars[] = 'ccvtk'; // Follower token.
		$query_vars[] = 'ccvfi'; // Follow ID.
		return $query_vars;
	}
}
