<?php

use CommentConverter\Plugin\Utils\Utils;

/**
 * Comment Converter Confirmation Email.
 *
 * @package CommentConverter
 */

 // Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0;">
	<tr>
		<td align="center" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px;">
			<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0;">
				<tr>
					<td width="100%" cellpadding="0" cellspacing="0" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; margin: 0;">
						<table align="center" width="600" cellpadding="0" cellspacing="0" role="presentation" style="width: 600px; margin: 18px auto 40px; padding: 0;">
							<tr>
								<td class="email-body" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; border-bottom: 1px solid #E2E3E9; padding-top: 22px;">
									<table>
										<tr>
											<td style="font-family: Helvetica, Arial, sans-serif; color: #1F2858; font-size: 14px; line-height: 1.3; font-weight: 400; padding-bottom: 22px;">
												<?php if ( $data['double_opt_in'] ) : ?>
													<?php esc_html_e( 'You opted to follow the conversation at', 'comment-notifications' ); ?>
												<?php else : ?>
													<?php esc_html_e( "You're now following the conversation at", 'comment-notifications' ); ?>
												<?php endif; ?>
												<br />
												<a href="[Post_Url]" style="font-family: Helvetica, Arial, sans-serif; color: #067CE1; font-size: 24px; line-height: 1.3; font-weight: 700; text-decoration: none;">[Post_Title]</a>
											</td>
										</tr>
										<tr>
											<td style="padding-bottom: 16px;">
												<?php if ( $data['double_opt_in'] ) : ?>
													<p style="color: #454D74; font-family: Helvetica; font-size: 14px;">
														<?php esc_html_e( 'Click the button below to confirm your subscription.', 'comment-notifications' ); ?>
													</p>

													<a href="[Confirm_Url]" style="display: inline-block; padding: 16px 24px; border-radius: 3px; background: #067CE1; color: #FFF; font-family: Helvetica; font-size: 20px; text-decoration-line: none;"><?php esc_html_e( 'Confirm', 'comment-notifications' ); ?></a>
												<?php else : ?>
													<p style="color: #454D74; font-family: Helvetica; font-size: 14px;">
														<?php esc_html_e( 'If you do not recognise this, click the link below to unsubscribe.', 'comment-notifications' ); ?>
														<a href="[Unsubscribe_Url]" style="color: #067CE1; font-family: Helvetica; font-size: 14px; font-weight: 700; text-decoration-line: underline;"><?php esc_html_e( 'Unsubscribe', 'comment-notifications' ); ?></a>
													</p>
												<?php endif; ?>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td class="email-footer" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px;">
									<table>
										<tr>
											<td style="font-family: Helvetica, Arial, sans-serif; color: #1F2858; font-size: 14px; line-height: 1.3; font-weight: 400;">
												<div style="margin: 16px 0;">
													<img width="200" alt="Comment Converter logo" src="<?php echo esc_url( Utils::dir_url( 'assets/logos/comment-converter-primary-logo.png' ) ); ?>" />
												</div>
												<p style="color: #6C7781; font-family: Helvetica, Arial, sans-serif; font-size: 11px;">
													<!-- [Manage_Subscriptions] -->
													<a href="[Manage_Subscriptions_Url]" style="color: #15C; font-family: Helvetica, Arial, sans-serif; text-decoration-line: underline;"><?php esc_html_e( 'Manage Subscriptions', 'comment-notifications' ); ?></a>
													|
													<!-- [Unsubscribe] -->
													<a href="[Unsubscribe_Url]" style="color: #15C; font-family: Helvetica, Arial, sans-serif; text-decoration-line: underline;"><?php esc_html_e( 'Unsubscribe', 'comment-notifications' ); ?></a>
													<?php esc_html_e( 'From Following', 'comment-notifications' ); ?>
													<a href="[Post_Url]" style="color: #087CE1; font-family: Helvetica, Arial, sans-serif; text-decoration-line: underline;">[Post_Title]</a>
												</p>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
