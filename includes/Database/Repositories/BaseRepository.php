<?php
/**
 * Comment Converter Follower Repository.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Database\Repositories;

use CommentConverter\Plugin\Database\Models\BaseModel;
use CommentConverter\Plugin\Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Follower Repository.
 *
 * @since 0.9.1
 */
abstract class BaseRepository {
	const DEFAULT_LIMIT = 10;

	/**
	 * The model associated with the repository.
	 *
	 * @since 0.9.1
	 *
	 * @var BaseModel $model The model associated with the repository.
	 */
	protected BaseModel $model;

	/**
	 * The name of the database table associated with the repository.
	 *
	 * @since 0.9.1
	 *
	 * @var string $table_name The name of the database table associated with the repository.
	 */
	protected string $table_name;

	/**
	 * Constructs a new instance of the repository.
	 *
	 * @since 0.9.1
	 */
	public function __construct() {
		$this->model      = Plugin::get( $this->get_model_class() );
		$this->table_name = $this->model->get_table();
	}

	/**
	 * Returns the name of the model class associated with the repository.
	 *
	 * @since 0.9.1
	 *
	 * @return string The name of the model class associated with the repository.
	 */
	abstract protected function get_model_class();

	/**
	 * Returns the name of the main table associated with the repository.
	 *
	 * @since 0.9.1
	 *
	 * @return string The name of the main table associated with the repository.
	 */
	public function get_table_name() {
		return $this->table_name;
	}

	/**
	 * Retrieves a single record from the database by its ID.
	 *
	 * @since 0.9.1
	 *
	 * @param int $id The ID of the record to retrieve.
	 *
	 * @return BaseModel|null The retrieved record or NULL if not found.
	 */
	public function get_by_id( $id ) {
		$results = $this->get_by_ids( array( $id ) );

		if ( empty( $results ) ) {
			return null;
		}

		return $results[0];
	}

	/**
	 * Retrieves records from the database by their IDs.
	 *
	 * @since 0.9.1
	 *
	 * @param array $ids The IDs of the records to retrieve.
	 *
	 * @return array The retrieved records or an empty array if none were found.
	 */
	public function get_by_ids( $ids ) {
		global $wpdb;

		$where = $this->process_where_clause(
			array(
				'id' => $ids,
			)
		);

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- $where already prepared.
		$results = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM %i WHERE $where", $this->table_name ) );

		return $this->hydrate_results( $results );
	}

	/**
	 * Updates one record in the database.
	 *
	 * @since 0.9.1
	 *
	 * @param BaseModel $record The record to update.
	 * @param array     $updated_attributes An array of attributes to update and their new values.
	 *
	 * @return BaseModel The updated record.
	 */
	public function update( BaseModel $record, array $updated_attributes = array() ) {
		$record->fill( $updated_attributes );
		$record->save();

		return $record;
	}

	/**
	 * Updates one or multiple records in the database.
	 *
	 * This method was necessary because $wpdb->update does not know how to handle WHERE IN clauses.
	 *
	 * @since 0.9.1
	 *
	 * @param int   $ids The IDs of the records to update.
	 * @param array $updated_attributes An array of attributes to update and their new values.
	 * @param array $extra_where An array of extra conditions to apply to the query.
	 *
	 * @return int|false The number of rows affected, or false on failure.
	 */
	public function update_batch( $ids, array $updated_attributes = array(), array $extra_where = array() ) {
		global $wpdb;

		// Unless the updated attribute is already set, let's make sure it's auto updated when updating records.
		if ( $this->model->has_updated_attribute() && empty( $updated_attributes['updated'] ) ) {
			$updated_attributes['updated'] = current_time( 'mysql' );
		}

		$set_attrs = $this->process_set_clause( $updated_attributes );

		$where = $this->process_where_clause(
			array_merge(
				array(
					'id' => $ids,
				),
				$extra_where
			)
		);

		$sql = "UPDATE `$this->table_name` SET " . $set_attrs . ' WHERE ' . $where;

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery -- Already prepared.
		return $wpdb->query( $sql );
	}

	/**
	 * Permanently deletes one or more records from the database.
	 *
	 * This method was necessary because $wpdb->delete does not know how to handle WHERE IN clauses.
	 *
	 * @since 0.9.1
	 *
	 * @param array|int $ids An array of record IDs to delete, or a single ID.
	 *
	 * @return int|false The number of rows affected, or false on failure.
	 */
	public function delete( $ids ) {
		global $wpdb;

		$where = $this->process_where_clause(
			array(
				'id' => $ids,
			)
		);

		$sql = "DELETE FROM `$this->table_name` WHERE " . $where;

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery -- $where already prepared.
		return $wpdb->query( $sql );
	}

	/**
	 * Hydrates the given results into model instances.
	 *
	 * @since 0.9.1
	 *
	 * @param array $results The results to hydrate.
	 *
	 * @return array The hydrated model instances.
	 */
	protected function hydrate_results( $results = array() ) {
		$collection = array();

		if ( empty( $results ) ) {
			return $collection;
		}

		foreach ( $results as $result ) {
			$collection[] = $this->model->from_db( $result );
		}

		return $collection;
	}

	/**
	 * Processes the given attributes for use in a SET clause.
	 *
	 * @since 0.9.1
	 *
	 * @param array $updated_attributes The attributes to process.
	 *
	 * @return string The processed attributes.
	 */
	protected function process_set_clause( $updated_attributes = array() ) {
		global $wpdb;

		$set_attrs = array();
		foreach ( $updated_attributes as $field => $value ) {
			$field = sanitize_key( $field );

			if ( is_null( $value ) ) {
				// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
				$set_attrs[] = $wpdb->prepare( "`%i` = NULL", $field );
				continue;
			}

			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder -- $field already prepared.
			$set_attrs[] = $wpdb->prepare( "`%i` = %s", $field, $value );
		}

		return implode( ', ', $set_attrs );
	}

	/**
	 * Processes the given conditions for use in a WHERE clause.
	 *
	 * @since 0.9.1
	 *
	 * @param array $raw_where The conditions to process.
	 *
	 * @return string The processed conditions.
	 */
	protected function process_where_clause( $raw_where = array() ) {
		global $wpdb;

		$where = array();
		foreach ( $raw_where as $field => $value ) {
			$field = sanitize_key( $field );

			if ( is_null( $value ) ) {
				// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
				$where[] = $wpdb->prepare( "`%i` IS NULL", $field );
				continue;
			}

			if ( 'NOT NULL' === $value ) {
				// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder
				$where[] = $wpdb->prepare( "`%i` IS NOT NULL", $field );
				continue;
			}

			if ( is_array( $value ) ) {
				foreach ( $value as & $val ) {
					$val = $wpdb->prepare( '%s', $val );
				}
				unset( $val );

				// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder, WordPress.DB.PreparedSQL.NotPrepared
				$where[] = $wpdb->prepare("%i IN (" . implode( ', ', $value ) . ")", $field );
			} else {
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder, WordPress.DB.PreparedSQL.NotPrepared -- Already prepared.
				$where[] = $wpdb->prepare( "`%i` = %s", $field, $value );
			}
		}

		return implode( ' AND ', $where );
	}
}
