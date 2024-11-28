import { __ } from '@wordpress/i18n';
import { PrimaryButton, SecondaryButton } from '../../../Common/Buttons/BaseButton';
import { IconLogoStroke } from '../../../Common/Icons';
import { ShadowBox } from '../../../Common/Layout/ShadowBox';
import * as urls from '../../../utils/urls';

export const Welcome = () => {
	return (
		<ShadowBox className="relative items-center text-center mt-[22px]">
			<IconLogoStroke width="72" height="72" className="absolute -mt-[22px]" />

			{/* Headline */}
			<div className="px-0 py-0 pt-[54px] pb-[30px]">
				<h1 className="text-primaryText text-[32px] leading-8 font-bold mb-2.5">
					{
						/* translators: Comment Converter is the name of the plugin. */
						__('Welcome to Comment Converter!', 'comment-notifications')
					}
				</h1>
				<p className="text-primaryText100 text-xl leading-7 mb-3.5 font-normal max-w-[780px]">
					{__(
						'The #1 way to turn commenters and visitors into engaged subscribers, leads and sales.',
						'comment-notifications'
					)}
				</p>
			</div>

			{/*  Video */}
			<div className="flex bg-neutral20 w-full justify-center items-center h-[400px]">
				<a
					as="a"
					href={urls.marketing('doc/guide-to-getting-started/?utm_source=plugin&utm_medium=onboarding')}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src={urls.assets('dashboard/getting-started-card.png')}
						alt={__('Getting Started Guide', 'comment-notifications')}
					/>
				</a>
			</div>

			{/* CTA */}
			<div className="px-0 pt-10 pb-[30px]">
				<p className="text-primaryText100 text-xl leading-7 font-normal max-w-[700px] mb-[30px]">
					{__('You’re now growing your community and influence with every comment.', 'comment-notifications')}
					<br />
					{__(
						'To learn more about how to get even more comments and engagement, check out our Experts Guide to Getting More Blog Comments below.',
						'comment-notifications'
					)}
				</p>
				<p className="text-primaryText100 text-xl leading-7 font-normal max-w-[700px]">
					{__(
						'P.S. We’ve got tons of new features ready to roll out soon with our Pro version. Click the button below to be notified as soon as it launches.',
						'comment-notifications'
					)}
				</p>
				<div className="flex items-center justify-center w-full pt-5">
					<SecondaryButton
						as="a"
						className="mr-5"
						href={urls.marketing('the-experts-guide-to-getting-more-blog-comments/?utm_source=plugin&utm_medium=onboarding')}
						size="xlarge"
						target="_blank"
						rel="noopener noreferrer"
					>
						{__('Read The Guide', 'comment-notifications')}
					</SecondaryButton>
					<PrimaryButton as="a" href={urls.upgrade({ utmMedium: 'welcomedashboard' })} target="_blank" rel="noopener noreferrer" size="xlarge">
						{__('Join Pro Waitlist', 'comment-notifications')}
					</PrimaryButton>
				</div>
			</div>
		</ShadowBox>
	);
};
