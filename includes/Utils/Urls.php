<?php
/**
 * Comment Converter Url Utils.
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Utils;

use CommentConverter\Plugin\Services\FollowerControl;
use CommentConverter\Plugin\Database\Models\Follower;
use CommentConverter\Plugin\Database\Models\Follow;
use CommentConverter\Plugin\Plugin;
use CommentConverter\Plugin\Settings\Settings;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter Url Utils.
 *
 * @since 0.9.1
 */
class Urls {

	/**
	 * Get the contextual CC dashboard url.
	 *
	 * @since 0.9.1
	 *
	 * @param  array $args Array of query args.
	 *
	 * @return string The dashboard url.
	 */
	public static function dashboard( $args = array() ) {
		return self::internal_admin( 'dashboard', $args );
	}

	/**
	 * Get a link to an CC admin page.
	 *
	 * @since 0.9.1
	 *
	 * @param  string $page Page shortened slug.
	 * @param  array  $args Array of query args.
	 *
	 * @return string The link to an CC admin page.
	 */
	public static function internal_admin( $page = '', $args = array() ) {
		if ( ! empty( $page ) ) {
			$args = wp_parse_args(
				$args,
				array(
					'page' => 'comment-converter-' . $page,
				)
			);
		}

		return self::admin( 'admin.php', $args );
	}

	/**
	 * Get an admin page url.
	 *
	 * @since 0.9.1
	 *
	 * @param string $path Optional path relative to the admin url.
	 * @param array  $args Array of query args.
	 *
	 * @return string The URL to an admin page.
	 */
	public static function admin( $path = '', $args = array() ) {
		$url = add_query_arg( $args, admin_url( $path ) );

		return esc_url_raw( $url );
	}

	/**
	 * Get upgrade url, with utm_medium param and optional feature.
	 *
	 * @since 0.9.1
	 *
	 * @param  string $utm_medium The utm_medium query param.
	 * @param  string $feature A feature slug.
	 * @param  string $return_url Url to return. Will default to wp_get_referer().
	 * @param  array  $args       Additional query args.
	 *
	 * @return string The upgrade url.
	 */
	public static function upgrade( $utm_medium, $feature = '', $return_url = '', $args = array() ) {
		$args = wp_parse_args(
			$args,
			array(
				'utm_source' => 'plugin',
				'utm_medium' => $utm_medium,
			)
		);

		if ( ! empty( $feature ) ) {
			$args['feature'] = $feature;
		}

		if ( ! empty( $return_url ) ) {
			$args['return'] = $return_url;
		}

		// $level = $this->options->get_level();
		// $path  = is_free_tier( $level ) ? 'lite-upgrade' : 'upgrade';
		$user                        = wp_get_current_user();
		$path                        = 'early-access';
		$args['wpf14180386_1|first'] = rawurlencode( sanitize_text_field( empty( $user->first_name ) ? $user->display_name : $user->first_name ) );
		$args['wpf14180386_1|last']  = rawurlencode( sanitize_text_field( $user->last_name ) );
		$args['wpf14180386_2']       = rawurlencode( sanitize_email( $user->user_email ) );
		$args['wpf14180386_3']       = rawurlencode( sanitize_text_field( site_url() ) );

		return self::marketing( $path, $args );
	}

	/**
	 * Get marketing url, with utm_medium params.
	 *
	 * @since 0.9.1
	 *
	 * @param  string $path The path on the app.
	 * @param  array  $args Additional query args.
	 *
	 * @return string The marketing url.
	 */
	public static function marketing( $path = '', $args = array() ) {
		$args = wp_parse_args(
			$args,
			array(
				'utm_source'   => 'plugin',
				'utm_medium'   => '',
			)
		);

		return add_query_arg( $args, sprintf( COMMENT_CONVERTER_MARKETING_URL . '/%1$s', $path ) );
	}

	/**
	 * Generates a URL for the authenticated follower dashboard.
	 *
	 * This function generates a token for the follower and appends it as a query parameter to the follower dashboard URL.
	 *
	 * @since 0.9.1
	 *
	 * @param Follower $follower The follower for whom to generate the dashboard URL.
	 *
	 * @return string The authenticated follower dashboard URL.
	 */
	public static function get_follower_dashboard_authenticated_url( Follower $follower ) {
		$settings         = Plugin::get( Settings::class );
		$follower_control = Plugin::get( FollowerControl::class );

		$token = $follower_control->generate_follower_token( $follower );

		return add_query_arg(
			array(
				'ccvtk' => $token,
			),
			$settings->get_follower_dashboard_url()
		);
	}

	/**
	 * Generates the follow confirmation URL.
	 *
	 * @since 0.9.1
	 *
	 * @param Follow $follow The follow to confirm.
	 *
	 * @return string The follow confirmation URL.
	 */
	public static function get_follow_confirmation_url( Follow $follow ) {
		$settings         = Plugin::get( Settings::class );
		$follower_control = Plugin::get( FollowerControl::class );

		$token = $follower_control->generate_follower_token( $follow->follower );

		return add_query_arg(
			array(
				'ccvtk' => $token,
				'ccvfi' => $follow->id,
			),
			$settings->get_follower_dashboard_url( 'confirm' )
		);
	}

	/**
	 * Generates the follow unsubscribe URL.
	 *
	 * @since 0.9.1
	 *
	 * @param Follow $follow The follow to unsubscribe from.
	 *
	 * @return string The follow unsubscription URL.
	 */
	public static function get_follow_unsubscription_url( Follow $follow ) {
		$settings         = Plugin::get( Settings::class );
		$follower_control = Plugin::get( FollowerControl::class );

		$token = $follower_control->generate_follower_token( $follow->follower );

		return add_query_arg(
			array(
				'ccvtk' => $token,
				'ccvfi' => $follow->id,
			),
			$settings->get_follower_dashboard_url( 'unsubscribe' )
		);
	}
}
