<?php

use CommentConverter\Plugin\Utils\Utils;

/**
 * Comment Converter Notification Email.
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
							<?php foreach ( $data['comments'] as $ccvtr_comment ) : ?>
							<tr>
								<td class="email-body" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; border-bottom: 1px solid #E2E3E9; padding-top: 22px;">
									<table>
										<tr>
											<td style="font-family: Helvetica, Arial, sans-serif; color: #1F2858; font-size: 14px; line-height: 1.3; font-weight: 400; padding-bottom: 22px;">
												<?php esc_html_e( 'There is a new comment on:', 'comment-notifications' ); ?>
												<br />
												<a href="<?php echo esc_url( get_permalink( $ccvtr_comment->comment_post_ID ) ); ?>" style="font-family: Helvetica, Arial, sans-serif; color: #067CE1; font-size: 24px; line-height: 1.3; font-weight: 700; text-decoration: none;"><?php echo esc_html( get_the_title( $ccvtr_comment->comment_post_ID ) ); ?></a>
											</td>
										</tr>
										<tr>
											<td style="padding-bottom: 16px;">
												<div style="color: #1F2858; font-family: Helvetica, Arial, sans-serif; font-size: 18px; line-height: 1.3; font-weight: 700;">
													&ldquo;<?php echo wp_kses( get_comment_text( $ccvtr_comment ), array() ); ?>&rdquo;
												</div>

												<p style="color: #454D74; font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1; font-weight: 400; padding: 8px 0 17px;">
													<!-- [View_Comment] -->
													<a href="<?php echo esc_url( get_comment_link( $ccvtr_comment ) ); ?>" style="color: #067CE1; font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1; font-weight: 400; text-decoration-line: underline;"><?php esc_html_e( 'View Comment', 'comment-notifications' ); ?></a>
													<?php esc_html_e( 'Posted by', 'comment-notifications' ); ?>
													<a href="<?php echo esc_url( get_comment_link( $ccvtr_comment ) ); ?>" style="color: #067CE1; font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1; font-weight: 400; text-decoration-line: underline;"><?php echo esc_html( get_comment_author( $ccvtr_comment ) ); ?></a>
												</p>

												<!-- [Reply_To_Comment] -->
												<a href="<?php echo esc_url( get_comment_link( $ccvtr_comment ) ); ?>" style="color: #067CE1; font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1; font-weight: 700; text-decoration-line: underline;"><?php esc_html_e( 'Reply to Comment', 'comment-notifications' ); ?></a>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<?php endforeach; ?>
							<?php if ( 1 === count( $data['comments'] ) ) : ?>
								<tr>
									<td class="email-body-after" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; border-bottom: 1px solid #E2E3E9;">
										<table>
											<tr>
												<td style="color: #454D74; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 1.3; padding: 22px 0;">
												<?php esc_html_e( 'You have requested to be notified any time a new reply is added to your comment on:', 'comment-notifications' ); ?>
													<br />
													&lsquo;<a href="<?php echo esc_url( get_permalink( $data['comments'][0]->comment_post_ID ) ); ?>" style="color: #067CE1; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 700; line-height: 1.3; text-decoration-line: underline;"><?php echo esc_html( get_the_title( $data['comments'][0]->comment_post_ID ) ); ?></a>&rsquo;
												</td>
											</tr>
										</table>
									</td>
								</tr>
							<?php endif; ?>
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
