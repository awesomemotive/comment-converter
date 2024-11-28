<?php
/**
 * Comment Converter Base Model.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Database\Models;

use CommentConverter\Plugin\Utils\Date;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Base Model.
 *
 * @since 0.9.1
 */
abstract class BaseModel implements \JsonSerializable {

	/**
	 * The table associated with the model.
	 *
	 * @since 0.9.1
	 *
	 * @var string
	 */
	protected string $table;

	/**
	 * The model's attributes.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected array $attributes = array();

	/**
	 * The model's relations.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected array $relations = array();

	/**
	 * The model's original attributes.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected array $original = array();

	/**
	 * The fillable attributes for the model.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected array $fillable = array();

	/**
	 * Whether the record was recently created.
	 *
	 * @since 0.9.1
	 *
	 * @var bool
	 */
	protected bool $is_new = false;

	/**
	 * Gets the database table name for the model.
	 *
	 * @since 0.9.1
	 *
	 * @return string The database table name for the model.
	 */
	public function get_table() {
		global $wpdb;
		return $wpdb->prefix . $this->table;
	}

	/**
	 * Creates a new model instance from the database attributes.
	 *
	 * @since 0.9.1
	 *
	 * @param array $attributes The database attributes to fill the model with.
	 *
	 * @return static The new model instance.
	 */
	public function from_db( $attributes = array() ) {
		$model = new static();
		$model->fill( (array) $attributes );
		$model->sync_original();
		return $model;
	}

	/**
	 * Finds a record by its ID.
	 *
	 * @since 0.9.1
	 *
	 * @param int $id The ID of the record.
	 *
	 * @return mixed Returns the record object if found, null otherwise.
	 */
	public function find( $id ) {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
		$attributes = $wpdb->get_row(
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder -- Already prepared.
			$wpdb->prepare( "SELECT * FROM %i WHERE id = %d", $this->get_table(), $id ),
			ARRAY_A
		);

		if ( empty( $attributes ) ) {
			return null;
		}

		return $this->from_db( $attributes );
	}

	/**
	 * Fill the model with an array of attributes.
	 *
	 * Only fillable attributes will be filled.
	 *
	 * @since 0.9.1
	 *
	 * @param array $attributes The model attributes.
	 *
	 * @return self The model instance.
	 */
	public function fill( array $attributes ) {
		foreach ( $this->filter_fillable( $attributes ) as $key => $value ) {
			if ( 'id' === $key ) {
				$value = (int) $value;
			}

			$this->attributes[ $key ] = $value;
		}

		return $this;
	}

	/**
	 * Determines if the model represents a record that was created recently.
	 *
	 * @since 0.9.1
	 *
	 * @return bool True if the model represents a record that was created recently, false otherwise.
	 */
	public function is_new() {
		return $this->is_new;
	}

	/**
	 * Saves the model to the database.
	 *
	 * @since 0.9.1
	 *
	 * @return $this The saved model instance.
	 */
	public function save() {
		global $wpdb;

		$this->update_timestamps();

		$attributes = $this->get_changed_attributes();

		if ( empty( $this->attributes['id'] ) ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
			$wpdb->insert(
				$this->get_table(),
				$attributes
			);

			$this->id     = $wpdb->insert_id;
			$this->is_new = true;
		} else {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
			$wpdb->update(
				$this->get_table(),
				$this->attributes,
				array( 'id' => $this->id )
			);

			$this->is_new = false;
		}

		$this->sync_original();

		return $this;
	}

	/**
	 * Checks if the model has the 'updated' attribute.
	 *
	 * @since 0.9.1
	 *
	 * @return bool Returns true if the model has the 'updated' attribute, false otherwise.
	 */
	public function has_updated_attribute() {
		return in_array( 'updated', $this->fillable, true );
	}

	/**
	 * Sync the original attributes with the current.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	protected function sync_original() {
		$this->original = $this->attributes;
	}

	/**
	 * Gets the changed attributes for the model.
	 *
	 * @since 0.9.1
	 *
	 * @return array The changed attributes for the model.
	 */
	protected function get_changed_attributes() {
		$changed = array();

		$curr_attrs = $this->filter_fillable( $this->attributes );
		foreach ( $curr_attrs as $key => $value ) {
			if ( ! isset( $this->original[ $key ] ) || $value !== $this->original[ $key ] ) {
				$changed[ $key ] = $value;
			}
		}

		return $changed;
	}

	/**
	 * Updates the created and updated timestamps for the model.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	protected function update_timestamps() {
		if ( in_array( 'updated', $this->fillable, true ) ) {
			$this->updated = current_time( 'mysql' );
		}

		if ( in_array( 'created', $this->fillable, true ) && empty( $this->attributes['created'] ) ) {
			$this->created = current_time( 'mysql' );
		}
	}

	/**
	 * Filters the given attributes to only include those that are fillable.
	 *
	 * @since 0.9.1
	 *
	 * @param array $attributes The attributes to filter.
	 *
	 * @return array The fillable attributes.
	 */
	protected function filter_fillable( $attributes = array() ) {
		$fillable_attrs = array();

		// get attributes from $this->attributes that are fillable.
		foreach ( $attributes as $key => $value ) {
			if ( ! in_array( $key, $this->fillable, true ) ) {
				continue;
			}

			$fillable_attrs[ $key ] = $value;
		}

		return $fillable_attrs;
	}

	/**
	 * Returns an array representation of the model's attributes for JSON serialization.
	 *
	 * @since 0.9.1
	 *
	 * @return array An array representation of the model's attributes for JSON serialization.
	 */
	#[\ReturnTypeWillChange]
	public function jsonSerialize() {
		return $this->to_array();
	}

	/**
	 * Returns an array representation of the model's attributes.
	 *
	 * @since 0.9.1
	 *
	 * @return array An array representation of the model's attributes.
	 */
	public function to_array() {
		$attrs = $this->attributes;

		if ( in_array( 'created', $this->fillable, true ) && ! empty( $attrs['created'] ) ) {
			$attrs['created_formatted'] = Date::format_date_str( $attrs['created'] );
		}

		if ( in_array( 'updated', $this->fillable, true ) && ! empty( $attrs['updated'] ) ) {
			$attrs['updated_formatted'] = Date::format_date_str( $attrs['updated'] );
		}

		return $attrs;
	}

	/**
	 * Dynamically retrieve attributes on the model.
	 *
	 * @since 0.9.1
	 *
	 * @param string $key The attribute name.
	 *
	 * @return mixed
	 */
	public function __get( $key ) {
		if ( array_key_exists( $key, $this->attributes ) ) {
			return $this->attributes[ $key ];
		}

		if ( in_array( $key, $this->relations, true ) && method_exists( $this, "get_{$key}" ) ) {
			return $this->{ "get_{$key}" }();
		}

		return $this->{$key};
	}

	/**
	 * Dynamically set attributes on the model.
	 *
	 * @since 0.9.1
	 *
	 * @param string $key The attribute name.
	 * @param mixed  $value The attribute value.
	 *
	 * @return void
	 */
	public function __set( $key, $value ) {
		if ( in_array( $key, $this->fillable, true ) ) {
			$this->attributes[ $key ] = $value;
			return;
		}

		$this->{$key} = $value;
	}

	/**
	 * Determines if the specified attribute is set.
	 *
	 * @since 0.9.1
	 *
	 * @param string $key The attribute key to check.
	 *
	 * @return bool Whether the attribute is set.
	 */
	public function __isset( $key ) {
		return isset( $this->attributes[ $key ] );
	}

	/**
	 * Returns an array representation of the model's attributes for serialization.
	 *
	 * @since 0.9.1
	 *
	 * @return array An array representation of the model's attributes for serialization.
	 */
	public function __serialize() {
		return $this->to_array();
	}
}
