<?php
/**
 * Comment Converter Classic Editor.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Bootstrap\Admin;

use CommentConverter\Plugin\Services\SystemControl;
use CommentConverter\Plugin\Services\DataStats;
use CommentConverter\Plugin\Settings\PostMeta;
use CommentConverter\Plugin\Settings\Settings;
use CommentConverter\Plugin\Utils\Urls;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Classic Editor.
 *
 * @since 0.9.1
 */
class ClassicEditor {

	/**
	 * Holds the instance of PostMeta.
	 *
	 * @since 0.9.1
	 *
	 * @var PostMeta
	 */
	protected $post_meta;

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
	 * Holds the instance of DataStats.
	 *
	 * @since 0.9.1
	 *
	 * @var DataStats
	 */
	protected $data_stats;

	/**
	 * Class constructor.
	 *
	 * @since 0.9.1
	 *
	 * @param SystemControl  $system_control Instance of SystemControl.
	 * @param PostMeta       $post_meta Instance of PostMeta.
	 * @param Settings       $settings Instance of Settings.
	 * @param DataStats      $data_stats Instance of DataStats.
	 */
	public function __construct( SystemControl $system_control, PostMeta $post_meta, Settings $settings, DataStats $data_stats ) {
		$this->system_control = $system_control;
		$this->post_meta      = $post_meta;
		$this->settings       = $settings;
		$this->data_stats     = $data_stats;
	}

	/**
	 * Setup the hooks.
	 *
	 * @since 0.9.1
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'add_meta_boxes', array( $this, 'register_side_panel' ) );
		add_action( 'post_comment_status_meta_box-options', array( $this, 'output_discussion_settings' ) );
		add_action( 'save_post', array( $this, 'save_post_settings' ), 10, 2 );
	}

	/**
	 * Register the Comment Converter metabox panel on the side.
	 *
	 * @since 0.9.1
	 */
	public function register_side_panel() {
		$post_types = $this->settings->get_enabled_post_types();
		foreach ( $post_types as $post_type ) {
			add_meta_box(
				'ccvtr-classic-post-settings',
				// translators: Comment Converter is the name of the plugin.
				esc_html__( 'Comment Converter', 'subscribe-to-comment-notifications-comment-converter' ),
				array( $this, 'output_side_panel' ),
				$post_type,
				'side',
				'default',
				array( '__back_compat_meta_box' => true )
			);
		}
	}

	/**
	 * Output the Comment Converter settings in the Discussion settings metabox.
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_Post $post The post object the Discussion settings is being generated for.
	 */
	public function output_discussion_settings( $post ) {
		// If this function is called we can assume the post supports comments.

		$post_type = $post->post_type;
		if ( ! $this->system_control->is_post_type_enabled( $post_type ) ) {
			return;
		}

		$enabled = $this->system_control->is_comment_following_enabled( $post->ID );
		wp_nonce_field( 'ccvtr_enable_comment_following', 'ccvtr_enable_comment_following_nonce' );
		?>
		<br />
		<label for="ccvtr_enable_comment_following" class="selectit">
			<input type="checkbox" name="ccvtr_enable_comment_following" id="ccvtr_enable_comment_following" value="1" <?php checked( ! empty( $enabled ) ); ?> />
			<?php esc_html_e( 'Allow comment following', 'subscribe-to-comment-notifications-comment-converter' ); ?>
		</label>
		<?php
	}

	/**
	 * Output the Comment Converter metabox panel.
	 *
	 * @since 0.9.1
	 *
	 * @param \WP_Post $post The post object.
	 */
	public function output_side_panel( $post ) {
		$post_stats = $this->data_stats->get_post_stats( $post->ID );

		$count = $post_stats['followers'] ?? 0;
		$url   = Urls::internal_admin( 'followers', array( 'post_id' => $post->ID ) );
		?>
		<div style="margin: 1em 0; display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
			<?php esc_html_e( 'Total followers from this post', 'subscribe-to-comment-notifications-comment-converter' ); ?>
			<span class="ccvtr-follower-badge"><?php echo esc_html( $count ); ?></span>
		</div>
		<p>
			<a href="<?php echo esc_url( $url ); ?>" target="_blank">
				<?php esc_html_e( 'View followers', 'subscribe-to-comment-notifications-comment-converter' ); ?>
			</a>
		</p>
		<?php
	}

	/**
	 * Save the Comment Converter post settings.
	 *
	 * @since 0.9.1
	 *
	 * @param int      $post_id Post Id.
	 * @param \WP_Post $post    Post object.
	 */
	public function save_post_settings( $post_id, $post ) {
		if (
			empty( $_POST['ccvtr_enable_comment_following_nonce'] )
			|| ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['ccvtr_enable_comment_following_nonce'] ) ), 'ccvtr_enable_comment_following' )
			|| empty( $post->post_type )
		) {
			return;
		}

		$type = get_post_type_object( $post->post_type );
		if (
			empty( $type->cap->edit_post )
			|| ! current_user_can( $type->cap->edit_post, $post_id )
		) {
			return;
		}

		$enabled = ! empty( $_POST['ccvtr_enable_comment_following'] );
		$this->post_meta->set_comment_following_enabled( $post_id, $enabled );
	}
}
