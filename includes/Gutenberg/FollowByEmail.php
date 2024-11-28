<?php
/**
 * Comment Converter Gutenberg's Follow By Email block.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Gutenberg;

use CommentConverter\Plugin\Services\FollowControl;
use CommentConverter\Plugin\Services\FollowerControl;
use CommentConverter\Plugin\Services\SystemControl;
use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\Html;
use CommentConverter\Plugin\Utils\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Gutenberg's Follow By Email block.
 *
 * @since 0.9.1
 */
class FollowByEmail {

	/**
	 * Holds the instance of Settings.
	 *
	 * @since 0.9.1
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Holds the instance of SystemControl.
	 *
	 * @since 0.9.1
	 *
	 * @var SystemControl
	 */
	protected $system_control;

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
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param Settings        $settings Instance of Settings.
	 * @param SystemControl   $system_control Instance of SystemControl.
	 * @param FollowControl   $follow_control Instance of FollowControl.
	 * @param FollowerControl $follower_control Instance of FollowerControl.
	 */
	public function __construct( Settings $settings, SystemControl $system_control, FollowControl $follow_control, FollowerControl $follower_control ) {
		$this->settings         = $settings;
		$this->system_control   = $system_control;
		$this->follow_control   = $follow_control;
		$this->follower_control = $follower_control;
	}

	/**
	 * Initialize the Follow By Email block.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		$this->register_block();
	}

	/**
	 * Register the Follow By Email block.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function register_block() {
		register_block_type(
			Utils::dir_path( 'build/Gutenberg/blocks/follow-by-email/block.json' ),
			array(
				'render_callback' => array( $this, 'render_block' ),
			)
		);
	}

	/**
	 * Renders the block with the given attributes and content.
	 *
	 * @since 0.9.1
	 *
	 * @param array     $block_attributes The attributes of the block.
	 * @param string    $content The content of the block.
	 * @param \WP_Block $block The block object.
	 *
	 * @return string Returns the rendered block.
	 */
	public function render_block( $block_attributes, $content, $block ) {
		$post_id = get_the_ID();

		if ( ! $this->system_control->is_comment_converter_enabled( $post_id ) ) {
			return '';
		}

		if ( ! $this->system_control->is_comment_following_enabled( $post_id ) ) {
			return '';
		}

		if ( empty( $content ) ) {
			return '';
		}

		$data_attrs = array(
			'data-post-id'    => $post_id,
			'data-post-title' => get_the_title(),
		);

		$follower = $this->follower_control->get_current_follower();

		if ( ! empty( $follower ) ) {
			if ( $follower instanceof Follower ) {
				if ( $this->follow_control->is_user_following_post( $follower, $post_id ) ) {
					$follower_dashboard_hyperlink = sprintf(
						'<a href="%s">%s</a>',
						esc_url( $this->settings->get_follower_dashboard_url() ),
						esc_html( $this->settings->get_comment_form_follower_dashboard_link_text() )
					);

					return Html::replace_parent_content( $content, $follower_dashboard_hyperlink );
				}

				$data_attrs['data-user-email']      = $follower->notification_email;
				$data_attrs['data-user-name']       = $follower->name;
				$data_attrs['data-user-subscribed'] = $follower->is_subscriber();
			} elseif ( is_array( $follower ) ) {
				$data_attrs['data-user-email'] = $follower['email'];
				$data_attrs['data-user-name']  = $follower['name'];
			}
		} else {
			$commenter_info = wp_get_current_commenter();

			$data_attrs['data-user-name']  = $commenter_info['comment_author'];
			$data_attrs['data-user-email'] = $commenter_info['comment_author_email'];
		}

		$data_attrs['data-nonce'] = wp_create_nonce( 'ccvtr-follow-by-email-' . $post_id );

		// By default, depending on the WP version, WP will not automatically enqueue the view script for dynamic blocks.
		if ( ! empty( $block->block_type->view_script ) ) {
			wp_enqueue_script( $block->block_type->view_script );
			wp_set_script_translations( $block->block_type->view_script, 'comment-notifications', Utils::dir_path( 'languages' ) );
		}

		// The data attribures will allows us to auto-fill the modal form when we can.
		return Html::add_data_attributes_to_markup( $content, $data_attrs );
	}
}
