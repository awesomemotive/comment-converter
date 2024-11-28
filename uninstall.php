<?php
/**
 * Uninstall Comment Converter.
 *
 * Remove:
 * - Follower table
 * - Follows table
 * - ccvtr post_meta
 * - Comment Converter settings/options
 * - Comment Converter Uploads
 *
 * @package CommentConverter
 *
 * @since 0.9.1
 *
 * @var WP_Filesystem_Base $wp_filesystem
 */

use CommentConverter\Plugin\Database\Schema\Schema;
use CommentConverter\Plugin\Settings\Options;

// Exit if accessed directly.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Load plugin file.
require_once 'comment-converter.php';

// Disable Action Schedule Queue Runner.
if ( class_exists( 'ActionScheduler_QueueRunner' ) ) {
	ActionScheduler_QueueRunner::instance()->unhook_dispatch_async_request();
}

// Confirm user has decided to remove all data, otherwise stop.
$ccvtr_settings = get_option( Options::OPTION_NAME, array() );

if (
	empty( $ccvtr_settings['uninstall_data'] ) ||
	is_plugin_active( 'comment-notifications/comment-converter.php' )
) {
	return;
}

global $wpdb;

// phpcs:disable WordPress.DB.DirectDatabaseQuery

// Drop all the database tables.
Schema::drop_all_tables();

// Delete all the plugin options.
$wpdb->query( "DELETE FROM $wpdb->options WHERE option_name LIKE 'ccvtr\_%'" );
$wpdb->query( "DELETE FROM $wpdb->options WHERE option_name LIKE 'comment_converter\_%'" );

// Delete plugin post meta.
$wpdb->query( "DELETE FROM $wpdb->postmeta WHERE meta_key LIKE 'ccvtr\_%'" );

global $wp_filesystem;

// Remove uploaded files.
$ccvtr_uploads_directory = wp_upload_dir();

if ( empty( $ccvtr_uploads_directory['error'] ) ) {
	$wp_filesystem->rmdir( $ccvtr_uploads_directory['basedir'] . '/comment-converter/', true );
}

// Remove translation files.
$ccvtr_languages_directory = defined( 'WP_LANG_DIR' ) ? trailingslashit( WP_LANG_DIR ) : trailingslashit( WP_CONTENT_DIR ) . 'languages/';
$ccvtr_translations        = glob( wp_normalize_path( $ccvtr_languages_directory . 'plugins/comment-notifications' ) );

if ( ! empty( $ccvtr_translations ) ) {
	foreach ( $ccvtr_translations as $ccvtr_file ) {
		$wp_filesystem->delete( $ccvtr_file );
	}
}

// Remove all scheduled actions related to the plugin.
if ( class_exists( 'ActionScheduler_DBStore' ) ) {
	ActionScheduler_DBStore::instance()->cancel_actions_by_group( 'comment_converter' );
}

// Remove schedule cron hooks.
wp_clear_scheduled_hook( 'ccvtr_notification_digest_cron_daily' );
wp_clear_scheduled_hook( 'ccvtr_notification_digest_cron_weekly' );
