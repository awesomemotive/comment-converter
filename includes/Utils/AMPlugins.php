<?php
/**
 * Comment Converter AM Plugins class.
 *
 * @since 0.9.1
 *
 * @package CommentConverter
 */

namespace CommentConverter\Plugin\Utils;

use CommentConverter\Plugin\Exceptions\PluginInstallationException;
use CommentConverter\Plugin\Utils\AMPlugins\AMPlugin;
use CommentConverter\Plugin\Utils\AMPlugins\InstallSkin;
use CommentConverter\Plugin\Utils\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment Converter AM Plugins class.
 *
 * @since 0.9.1
 */
class AMPlugins {

	/**
	 * Plugins array.
	 *
	 * @since 0.9.1
	 *
	 * @var array
	 */
	protected static $plugins = array();

	/**
	 * Gets the list of AM plugins.
	 *
	 * @since 0.9.1
	 *
	 * @return array List of AM plugins.
	 */
	public function get_list() {
		if ( empty( self::$plugins ) ) {
			self::$plugins = array(
				'optinmonster/optin-monster-wp-api.php'   => array(
					'slug'   => 'optinmonster',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-om.png' ),
					'class'  => 'optinmonster',
					'check'  => array( 'class' => 'OMAPI' ),
					'name'   => 'OptinMonster',
					'desc'   => __( 'Instantly get more subscribers, leads, and sales with the #1 conversion optimization toolkit. Create high converting popups, announcement bars, spin a wheel, and more with smart targeting and personalization.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/optinmonster.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => '',
						'name'   => 'OptinMonster',
						'url'    => 'https://optinmonster.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'wpforms-lite/wpforms.php'                => array(
					'slug'   => 'wpforms',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-wp-forms.png' ),
					'class'  => 'wpforms-litewpformsphp',
					'check'  => array( 'function' => 'wpforms' ),
					'name'   => 'WPForms',
					'desc'   => __( 'The best drag & drop WordPress form builder. Easily create beautiful contact forms, surveys, payment forms, and more with our 1300+ form templates. Trusted by over 6 million websites as the best forms plugin.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/wpforms-lite.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'wpforms/wpforms.php',
						'name'   => 'WPForms Pro',
						'url'    => 'https://wpforms.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'google-analytics-for-wordpress/googleanalytics.php' => array(
					'slug'   => 'monsterinsights',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-mi.png' ),
					'class'  => 'google-analytics-for-wordpressgoogleanalyticsphp',
					'check'  => array( 'function' => 'MonsterInsights' ),
					'name'   => 'MonsterInsights',
					'desc'   => __( 'The leading WordPress analytics plugin that shows you how people find and use your website, so you can make data driven decisions to grow your business. Properly set up Google Analytics without writing code.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/google-analytics-for-wordpress.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'google-analytics-premium/googleanalytics-premium.php',
						'name'   => 'MonsterInsights Pro',
						'url'    => 'https://www.monsterinsights.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'wp-mail-smtp/wp_mail_smtp.php'           => array(
					'slug'   => 'wpmailsmtp',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-wp-mail-smtp.png' ),
					'class'  => 'wp-mail-smtpwp-mail-smtpphp',
					'check'  => array( 'function' => 'wp_mail_smtp' ),
					'name'   => 'WP Mail SMTP',
					'desc'   => __( 'Improve your WordPress email deliverability and make sure that your website emails reach user’s inbox with the #1 SMTP plugin for WordPress. Over 3 million websites use it to fix WordPress email issues.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/wp-mail-smtp.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'wp-mail-smtp-pro/wp_mail_smtp.php',
						'name'   => 'WP Mail SMTP',
						'url'    => 'https://wpmailsmtp.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'all-in-one-seo-pack/all_in_one_seo_pack.php' => array(
					'slug'   => 'aioseo',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-aioseo.png' ),
					'class'  => 'all-in-one-seo-packall-in-one-seo-packphp',
					'check'  => array(
						'constant' => array(
							'AIOSEOP_VERSION',
							'AIOSEO_VERSION',
						),
					),
					'name'   => 'AIOSEO',
					'desc'   => __( 'The original WordPress SEO plugin and toolkit that improves your website’s search rankings. Comes with all the SEO features like Local SEO, WooCommerce SEO, sitemaps, SEO optimizer, schema, and more.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/all-in-one-seo-pack.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'all-in-one-seo-pack-pro/all_in_one_seo_pack.php',
						'name'   => 'All-in-One SEO Pack',
						'url'    => 'https://aioseo.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'coming-soon/coming-soon.php'             => array(
					'slug'   => 'seedprod',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-seedprod.png' ),
					'class'  => 'coming-sooncoming-soonphp',
					'check'  => array(
						'constant' => array(
							'SEEDPROD_PRO_VERSION',
							'SEEDPROD_VERSION',
						),
					),
					'name'   => 'SeedProd',
					'desc'   => __( 'The fastest drag & drop landing page builder for WordPress. Create custom landing pages without writing code, connect them with your CRM, collect subscribers, and grow your audience. Trusted by 1 million sites.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/coming-soon.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => '~seedprod-coming-soon-pro*~',
						'name'   => 'SeedProd',
						'url'    => 'https://www.seedprod.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'rafflepress/rafflepress.php'             => array(
					'slug'   => 'rafflepress',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-rafflepress.png' ),
					'class'  => 'rafflepressrafflepressphp',
					'check'  => array(
						'constant' => array(
							'RAFFLEPRESS_VERSION',
							'RAFFLEPRESS_PRO_VERSION',
						),
					),
					'name'   => 'RafflePress',
					'desc'   => __( 'Turn your website visitors into brand ambassadors! Easily grow your email list, website traffic, and social media followers with the most powerful giveaways & contests plugin for WordPress.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/rafflepress.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'rafflepress-pro/rafflepress-pro.php',
						'name'   => 'RafflePress',
						'url'    => 'https://rafflepress.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'trustpulse-api/trustpulse.php'           => array(
					'slug'   => 'trustpulse',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-trustpulse.png' ),
					'class'  => 'trustpulseapitrustpulsephp',
					'check'  => array( 'class' => 'TPAPI' ),
					'name'   => 'TrustPulse',
					'desc'   => __( 'TrustPulse is the honest marketing platform that leverages and automates the real power of social proof to instantly increase trust, conversions and sales.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/trustpulse-api.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => '',
						'name'   => 'TrustPulse',
						'url'    => 'https://trustpulse.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'pushengage/main.php'                     => array(
					'slug'   => 'pushengage',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-pushengage.png' ),
					'class'  => 'pushengagemainphp',
					'check'  => array( 'constant' => 'PUSHENGAGE_VERSION' ),
					'name'   => 'PushEngage',
					'desc'   => __( 'Connect with your visitors after they leave your website with the leading web push notification software. Over 10,000+ businesses worldwide use PushEngage to send 15 billion notifications each month.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/pushengage.zip',
					'action' => 'install',
				),
				'instagram-feed/instagram-feed.php'       => array(
					'slug'   => 'sbinstagram',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-sb-instagram.png' ),
					'check'  => array( 'constant' => 'SBIVER' ),
					'name'   => 'Smash Balloon Instagram Feeds',
					'desc'   => __( 'Easily display Instagram content on your WordPress site without writing any code. Comes with multiple templates, ability to show content from multiple accounts, hashtags, and more. Trusted by 1 million websites.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/instagram-feed.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'instagram-feed-pro/instagram-feed.php',
						'name'   => 'Smash Balloon Instagram Feeds Pro',
						'url'    => 'https://smashballoon.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'custom-facebook-feed/custom-facebook-feed.php' => array(
					'slug'   => 'sbfacebook',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-sb-fb.png' ),
					'check'  => array( 'constant' => 'CFFVER' ),
					'name'   => 'Smash Balloon Facebook Feeds',
					'desc'   => __( 'Easily display Facebook content on your WordPress site without writing any code. Comes with multiple templates, ability to embed albums, group content, reviews, live videos, comments, and reactions.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/custom-facebook-feed.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'custom-facebook-feed-pro/custom-facebook-feed.php',
						'name'   => 'Smash Balloon Facebook Feeds Pro',
						'url'    => 'https://smashballoon.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'feeds-for-youtube/youtube-feed.php'      => array(
					'slug'   => 'sbyoutube',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-sb-youtube.png' ),
					'check'  => array( 'constant' => 'SBYVER' ),
					'name'   => 'Smash Balloon YouTube Feeds',
					'desc'   => __( 'Easily display YouTube videos on your WordPress site without writing any code. Comes with multiple layouts, ability to embed live streams, video filtering, ability to combine multiple channel videos, and more.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/feeds-for-youtube.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'youtube-feed-pro/youtube-feed.php',
						'name'   => 'Smash Balloon YouTube Feeds Pro',
						'url'    => 'https://smashballoon.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'custom-twitter-feeds/custom-twitter-feed.php' => array(
					'slug'   => 'sbtwitter',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-sb-twitter.png' ),
					'check'  => array( 'constant' => 'CTF_VERSION' ),
					'name'   => 'Smash Balloon Twitter Feeds',
					'desc'   => __( 'Easily display Twitter content in WordPress without writing any code. Comes with multiple layouts, ability to combine multiple Twitter feeds, Twitter card support, tweet moderation, and more.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/custom-twitter-feeds.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'custom-twitter-feeds-pro/custom-twitter-feed.php',
						'name'   => 'Smash Balloon Twitter Feeds Pro',
						'url'    => 'https://smashballoon.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'reviews-feed/sb-reviews.php'             => array(
					'slug'   => 'sbreviewsfeed',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-sb-rf.png' ),
					'check'  => array( 'constant' => 'SBRVER' ),
					'name'   => 'Smash Balloon Reviews Feed',
					'desc'   => __( 'Easily display Google reviews, Yelp reviews, and more in a clean customizable feed. Comes with multiple layouts, customizable review content, leave-a-review link, review moderation, and more.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/reviews-feed.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'reviews-feed-pro/sb-reviews-pro.php',
						'name'   => 'Smash Balloon Reviews Feed Pro',
						'url'    => 'https://smashballoon.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'searchwp/index.php'                      => array(
					'slug'   => 'searchwp',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-searchwp.png' ),
					'check'  => array( 'constant' => 'SEARCHWP_VERSION' ),
					'name'   => 'SearchWP',
					'desc'   => __( 'The most advanced WordPress search plugin. Customize your WordPress search algorithm, reorder search results, track search metrics, and everything you need to leverage search to grow your business.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://searchwp.com/',
					'action' => 'redirect',
				),
				'affiliate-wp/affiliate-wp.php'           => array(
					'slug'   => 'affiliatewp',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-affwp.png' ),
					'check'  => array( 'function' => 'affiliate_wp' ),
					'name'   => 'AffiliateWP',
					'desc'   => __( 'The #1 affiliate management plugin for WordPress. Easily create an affiliate program for your eCommerce store or membership site within minutes and start growing your sales with the power of referral marketing.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://affiliatewp.com',
					'action' => 'redirect',
				),
				'stripe/stripe-checkout.php'              => array(
					'slug'   => 'wpsimplepay',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-wp-simple-pay.png' ),
					'check'  => array( 'constant' => 'SIMPLE_PAY_VERSION' ),
					'name'   => 'WP Simple Pay',
					'desc'   => __( 'The #1 Stripe payments plugin for WordPress. Start accepting one-time and recurring payments on your WordPress site without setting up a shopping cart. No code required.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/stripe.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'wp-simple-pay-pro-3/simple-pay.php',
						'name'   => 'WP Simple Pay Pro',
						'url'    => 'https://wpsimplepay.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'easy-digital-downloads/easy-digital-downloads.php' => array(
					'slug'   => 'edd',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-edd.png' ),
					'check'  => array( 'function' => 'EDD' ),
					'name'   => 'Easy Digital Downloads',
					'desc'   => __( 'The best WordPress eCommerce plugin for selling digital downloads. Start selling eBooks, software, music, digital art, and more within minutes. Accept payments, manage subscriptions, advanced access control, and more.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/easy-digital-downloads.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'easy-digital-downloads-pro/easy-digital-downloads.php',
						'name'   => 'Easy Digital Downloads Pro',
						'url'    => 'https://easydigitaldownloads.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'sugar-calendar-lite/sugar-calendar-lite.php' => array(
					'slug'   => 'sugarcalendar',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-sugarcalendar.png' ),
					'check'  => array( 'class' => 'Sugar_Calendar\\Requirements_Check' ),
					'name'   => 'Sugar Calendar',
					'desc'   => __( 'A simple & powerful event calendar plugin for WordPress that comes with all the event management features including payments, scheduling, timezones, ticketing, recurring events, and more.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/sugar-calendar-lite.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'sugar-calendar/sugar-calendar.php',
						'name'   => 'Sugar Calendar Professional',
						'url'    => 'https://sugarcalendar.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'charitable/charitable.php'               => array(
					'slug'   => 'charitable',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-charitable.png' ),
					'check'  => array( 'class' => 'Charitable' ),
					'name'   => 'WP Charitable',
					'desc'   => __( 'Top-rated WordPress donation and fundraising plugin. Over 10,000+ non-profit organizations and website owners use Charitable to create fundraising campaigns and raise more money online.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/charitable.zip',
					'action' => 'install',
				),
				'insert-headers-and-footers/ihaf.php'     => array(
					'slug'   => 'wpcode',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-wpcode.png' ),
					'check'  => array( 'function' => 'WPCode' ),
					'name'   => 'WPCode',
					'desc'   => __( 'Future proof your WordPress customizations with the most popular code snippet management plugin for WordPress. Trusted by over 1,500,000+ websites for easily adding code to WordPress right from the admin area.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/insert-headers-and-footers.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'wpcode-premium/wpcode.php',
						'name'   => 'WPCode Premium',
						'url'    => 'https://wpcode.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'duplicator/duplicator.php'               => array(
					'slug'   => 'duplicator',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-duplicator.png' ),
					'check'  => array(
						'constant' => array(
							'DUPLICATOR_VERSION',
							'DUPLICATOR_PRO_PHP_MINIMUM_VERSION',
						),
					),
					'name'   => 'Duplicator',
					'desc'   => __( 'Leading WordPress backup & site migration plugin. Over 1,500,000+ smart website owners use Duplicator to make reliable and secure WordPress backups to protect their websites. It also makes website migration really easy.', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/duplicator.zip',
					'action' => 'install',
					'pro'    => array(
						'plugin' => 'duplicator-pro/duplicator-pro.php',
						'name'   => 'Duplicator Pro',
						'url'    => 'https://duplicator.com/?utm_source=WordPress&utm_medium=Plugin&utm_campaign=CommentConverterAboutUs',
					),
				),
				'uncanny-automator/uncanny-automator.php' => array(
					'slug'   => 'uncanny-automator',
					'icon'   => Utils::dir_url( 'assets/images/am-plugins/plugin-uncanny-automator.png' ),
					'class'  => 'uncanny-automatoruncanny-automatorphp',
					'check'  => array( 'constant' => 'AUTOMATOR_PLUGIN_VERSION' ),
					'name'   => 'Uncanny Automator',
					'desc'   => __( 'Connect your WordPress plugins, sites and apps together with powerful automations. Save time and money with the #1 automation plugin for WordPress!', 'subscribe-to-comment-notifications-comment-converter' ),
					'url'    => 'https://downloads.wordpress.org/plugin/uncanny-automator.zip',
					'action' => 'install',
					'data'   => array(
						'dashboard_url' => add_query_arg(
							array(
								'post_type' => 'uo-recipe',
								'page'      => 'uncanny-automator-dashboard',
							),
							admin_url( 'edit.php' )
						),
					),
				),
			);
			foreach ( self::$plugins as $plugin_id => $plugin ) {
				self::$plugins[ $plugin_id ]['id'] = $plugin_id;
			}
		}

		return self::$plugins;
	}

	/**
	 * Gets the list of AM plugins which include plugin status (installed/activated).
	 *
	 * @since 0.9.1
	 *
	 * @return array List of AM plugins.
	 */
	public function get_list_with_status() {
		$this->get_list();
		foreach ( self::$plugins as $plugin_id => $data ) {
			if ( ! isset( $data['status'] ) ) {
				self::$plugins[ $plugin_id ] = $this->get( $plugin_id )->get_data();
			}
		}

		return self::$plugins;
	}

	/**
	 * Get given Plugin instance.
	 *
	 * @since 0.9.1
	 *
	 * @param  string $plugin_id The plugin ID.
	 *
	 * @return AMPlugin
	 */
	public function get( $plugin_id ) {
		return AMPlugin::get( $plugin_id );
	}

	/**
	 * Installs and activates a plugin for a given url (if user is allowed).
	 *
	 * @since 0.9.1
	 *
	 * @param AMPlugin $plugin The Plugin instance.
	 *
	 * @return array On success.
	 *
	 * @throws PluginInstallationException On error.
	 */
	public function install_plugin( AMPlugin $plugin ) {

		$not_allowed_exception = new PluginInstallationException( esc_html__( 'Sorry, not allowed!', 'subscribe-to-comment-notifications-comment-converter' ), rest_authorization_required_code() );

		// Check for permissions.
		if ( ! current_user_can( 'install_plugins' ) ) {
			throw $not_allowed_exception;
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';
		$creds = request_filesystem_credentials( admin_url( 'admin.php' ), '', false, false, null );

		// Check for file system permissions.
		if ( false === $creds ) {
			throw $not_allowed_exception;
		}

		// We do not need any extra credentials if we have gotten this far, so let's install the plugin.
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		if ( ! function_exists( 'get_plugin_data' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$skin = new InstallSkin();

		// Create the plugin upgrader with our custom skin.
		$installer = new \Plugin_Upgrader( $skin );

		// Error check.
		if ( ! method_exists( $installer, 'install' ) ) {
			throw new PluginInstallationException( esc_html__( 'Missing required installer!', 'subscribe-to-comment-notifications-comment-converter' ), 500 );
		}

		$result = $installer->install( esc_url_raw( $plugin['url'] ) );

		if ( ! $installer->plugin_info() ) {
			throw new PluginInstallationException( esc_html__( 'Plugin failed to install!', 'subscribe-to-comment-notifications-comment-converter' ), 500 );
		}

		update_option(
			sanitize_text_field( $plugin['slug'] . '_referred_by' ),
			'comment-converter'
		);

		$plugin_basename = $installer->plugin_info();

		// Activate the plugin silently.
		try {
			$this->activate_plugin( $plugin_basename );

			return array(
				'message'      => esc_html__( 'Plugin installed & activated.', 'subscribe-to-comment-notifications-comment-converter' ),
				'is_activated' => true,
				'basename'     => $plugin_basename,
			);
		} catch ( \Exception $e ) {
			return array(
				'message'          => esc_html__( 'Plugin installed.', 'subscribe-to-comment-notifications-comment-converter' ),
				'is_activated'     => false,
				'basename'         => $plugin_basename,
				'activation_error' => $e->getMessage(),
			);
		}
	}

	/**
	 * Activates a plugin with a given plugin name (if user is allowed).
	 *
	 * @since 0.9.1
	 *
	 * @param string $plugin_id The plugin id.
	 *
	 * @return array On success.
	 *
	 * @throws PluginInstallationException On error.
	 */
	public function activate_plugin( $plugin_id ) {

		// Check for permissions.
		if ( ! current_user_can( 'activate_plugins' ) ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- The exceptions are not meant to be outputted as HTML.
			throw new PluginInstallationException( esc_html__( 'Sorry, not allowed!', 'subscribe-to-comment-notifications-comment-converter' ), rest_authorization_required_code() );
		}

		if ( ! function_exists( 'get_plugin_data' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$activate = activate_plugin( sanitize_text_field( $plugin_id ), '', false, true );

		if ( is_wp_error( $activate ) ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- The exceptions are not meant to be outputted as HTML.
			throw new PluginInstallationException( esc_html__( 'Could not activate plugin. Error: ', 'subscribe-to-comment-notifications-comment-converter' ) . $activate->get_error_message(), $activate->get_error_code() );
		}

		/**
		 * Prevent the various welcome/onboarding redirects that may occur when activating plugins.
		 * We are deleting the transient or updating the option so the welcome redirect does not occur when the plugin is activated by the user.
		 */
		switch ( $plugin_id ) {
			case 'google-analytics-for-wordpress/googleanalytics.php':
				delete_transient( '_monsterinsights_activation_redirect' );
				break;
			case 'wpforms-lite/wpforms.php':
				update_option( 'wpforms_activation_redirect', true );
				break;
			case 'all-in-one-seo-pack/all_in_one_seo_pack.php':
				update_option( 'aioseo_activation_redirect', true );
				break;
			case 'trustpulse-api/trustpulse.php':
				delete_option( 'trustpulse_api_plugin_do_activation_redirect' );
				break;
		}

		return array(
			'message'      => esc_html__( 'Plugin activated.', 'subscribe-to-comment-notifications-comment-converter' ),
			'basename'     => $plugin_id,
			'is_activated' => true,
		);
	}
}
