<?php
/**
 * Comment Converter Html Utils.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Html Utils.
 *
 * @since 0.9.1
 */
class Html {

	/**
	 * Adds data attributes to the given markup.
	 *
	 * @since 0.9.1
	 *
	 * @param string $markup The original markup.
	 * @param array  $data_attributes The data attributes to add.
	 *
	 * @return string Returns the markup with the added data attributes.
	 */
	public static function add_data_attributes_to_markup( $markup, $data_attributes ) {
		// Create a new DOMDocument.
		$dom = new \DOMDocument();

		// Load the HTML markup into the DOMDocument.
		$dom->loadHTML( $markup, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );

		// Get the top element (root) of the document.
		// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$root = $dom->documentElement;

		if ( $root ) {
			// Add data attributes to the 'p' tag.
			foreach ( $data_attributes as $attribute => $value ) {
				$root->setAttribute( $attribute, htmlspecialchars( $value ) );
			}
		}

		// Save the modified HTML back to a string.
		$modified_markup = $dom->saveHTML();

		// Return the modified markup.
		return $modified_markup;
	}

	/**
	 * Replaces content from parent to given markup.
	 *
	 * @since 0.9.1
	 *
	 * @param string $markup The original markup.
	 * @param string $new_content The new content.
	 *
	 * @return string Returns the markup with the new content.
	 */
	public static function replace_parent_content( $markup, $new_content ) {
		// Create a new DOMDocument.
		$dom = new \DOMDocument();

		// Load the HTML markup into the DOMDocument.
		$dom->loadHTML( $markup, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );

		// Get the top element (root) of the document.
		// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$root = $dom->documentElement;

		if ( $root ) {
			// Create a DOMDocumentFragment to parse the HTML fragment.
			$fragment = $dom->createDocumentFragment();
			$fragment->appendXML( $new_content );

			// Remove all child nodes of the root.
			while ( $root->hasChildNodes() ) {
				$root->removeChild( $root->firstChild );
			}

			// Append the new node to the root.
			$root->appendChild( $fragment );
		}

		// Save the modified HTML back to a string.
		$modified_markup = $dom->saveHTML();

		// Return the modified markup.
		return $modified_markup;
	}

	/**
	 * Appends a markup content to the given markup.
	 *
	 * @since 0.9.1
	 *
	 * @param string $markup The original markup.
	 * @param string $content The markup to append.
	 *
	 * @return string The modified markup with the following badge appended.
	 */
	public static function append_to_parent( $markup, $content ) {
		// Create a new DOMDocument.
		$dom = new \DOMDocument();

		// Load the string markup into the DOMDocument.
		$dom->loadHTML( $markup, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );

		// Create a DOMDocumentFragment to parse the HTML fragment.
		$fragment = $dom->createDocumentFragment();
		$fragment->appendXML( $content );

		// Append the new element to the root element.
		// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$dom->documentElement->appendChild( $fragment );

		// Save the modified DOMDocument back to a string.
		$modified_markup = $dom->saveHTML();

		// Output the modified string markup.
		return $modified_markup;
	}
}
