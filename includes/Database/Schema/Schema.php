<?php
/**
 * Comment Converter Schema.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Database\Schema;

use CommentConverter\Plugin\Settings\Options;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Schema.
 *
 * @since 0.9.1
 */
class Schema {
	/**
	 * The version of the database schema.
	 *
	 * @since 0.9.1
	 *
	 * @var string $db_version The version of the database schema.
	 */
	protected $db_version = '1.0.0';

	/**
	 * The character set and collation for the database schema.
	 *
	 * @since 0.9.1
	 *
	 * @var string $charset_collate The character set and collation for the database schema.
	 */
	protected $charset_collate;

	/**
	 * The table prefix for the database schema.
	 *
	 * @since 0.9.1
	 *
	 * @var string $table_prefix The table prefix for the database schema.
	 */
	protected $table_prefix;

	/**
	 * Holds the instance of Options.
	 *
	 * @since 0.9.1
	 *
	 * @var Options
	 */
	protected $options;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Options $options Instance of Options.
	 *
	 * @return void
	 */
	public function __construct( Options $options ) {
		$this->options = $options;
	}

	/**
	 * Initializes the database schema.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		global $wpdb;

		// Get the installed database schema version from plugin options.
		$installed_db_version = $this->options->get_db_version();

		// If the installed database has been updated already, do nothing.
		if ( $installed_db_version === $this->db_version ) {
			return;
		}

		// Required to use dbDelta().
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		// Set the properties to be used in the tabels setup.
		$this->charset_collate = $wpdb->get_charset_collate();
		$this->table_prefix    = $wpdb->prefix;

		// Setup the tables.
		$this->setup_followers_table();
		$this->setup_follow_table();

		// Update the database schema version.
		$this->options->set_db_version( $this->db_version );
	}

	/**
	 * Sets up the followers table in the database schema.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	protected function setup_followers_table() {
		$table_name = $this->table_prefix . 'ccvtr_followers';

		// Define the table schema.
		$sql = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name tinytext NULL,
			notification_email varchar(100) NOT NULL,
			notification_frequency enum('immediately', 'daily', 'weekly') NOT NULL DEFAULT 'immediately',
			default_follow_type enum('replies', 'all', 'no') NOT NULL DEFAULT 'replies',
			user_id bigint(20) unsigned NOT NULL DEFAULT '0',
			is_verified tinyint(1) NOT NULL DEFAULT '0',
			is_subscriber tinyint(1) NOT NULL DEFAULT '0',
			salt int(15) NOT NULL,
			unique_key varchar(50) NOT NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			KEY follower_notification_email (notification_email),
			KEY follower_unique_key (unique_key)
		) $this->charset_collate;";

		dbDelta( $sql );
	}

	/**
	 * Sets up the follow table in the database schema.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	protected function setup_follow_table() {
		$table_name = $this->table_prefix . 'ccvtr_follows';

		// Define the table schema.
		$sql = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			post_id bigint(20) unsigned NOT NULL DEFAULT '0',
			comment_id bigint(20) unsigned NOT NULL DEFAULT '0',
			follower_id bigint(20) unsigned NOT NULL DEFAULT '0',
			type enum('replies', 'all', 'no') NOT NULL DEFAULT 'replies',
			has_subscribed tinyint(1) NOT NULL DEFAULT '0',
			confirmed datetime NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			KEY follow_post_id (post_id),
			KEY follow_comment_id (comment_id),
			KEY follow_follower_id (follower_id)
		) $this->charset_collate;";

		dbDelta( $sql );
	}

	/**
	 * Drops all the tables from the database.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public static function drop_all_tables() {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.SchemaChange
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}ccvtr_followers" );
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.SchemaChange
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}ccvtr_follows" );
	}
}
