import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { PrimaryButton } from '../../../../Common/Buttons/BaseButton';
import { ShadowBox } from '../../../../Common/Layout/ShadowBox';
import * as urls from '../../../../utils/urls';
import { IconClose2 } from '../../../../Common/Icons';

export const Welcome = (props) => {
	const { onDismiss } = props;

	const userName = window?.ccData?.loggedInUserData?.first_name;

	return (
		<ShadowBox className="relative items-center text-center">
			<button onClick={onDismiss}>
				<IconClose2 width="10" height="10" className="absolute right-0 mt-4 mr-4 text-gray" />
			</button>

			<div className="flex flex-row px-[30px] py-10">
				<div className="flex flex-col items-start justify-center w-[650px] mr-[50px] rtl:!mr-0 rtl:ml-[50px]">
					<h2 className="text-base text-primaryText100 leading-5 font-bold mb-1.5">
						{__('Getting Started', 'subscribe-to-comment-notifications-comment-converter')}
					</h2>
					<h1 className="text-[32px] text-primaryText leading-10 font-bold tracking-[-0.03em] mb-5">
						{__('Welcome Back', 'subscribe-to-comment-notifications-comment-converter')}{' '}
						{userName ? `${userName}!` : null}
					</h1>
					<p className="mb-5 text-base font-normal leading-6 text-left text-primaryText100">
						{__(
							'You’re already on your way to turning commenters into subscribers and sales by enabling visitors to follow comments by email with just one click. See what else you can do in our Guide to Getting Started with Comment Converter below.',
							'subscribe-to-comment-notifications-comment-converter'
						)}
					</p>
					<PrimaryButton
						as="a"
						href={urls.marketing('doc/guide-to-getting-started/?utm_source=plugin&utm_medium=dashboard')}
						target="_blank"
						rel="noopener noreferrer"
						size="xlarge"
					>
						{__('Read the Guide', 'subscribe-to-comment-notifications-comment-converter')}
					</PrimaryButton>
				</div>

				<div className="flex w-[400px] items-center">
					<a
						as="a"
						href={urls.marketing('doc/guide-to-getting-started/?utm_source=plugin&utm_medium=dashboard')}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src={urls.assets('dashboard/getting-started-card.png')}
							alt={__('Getting Started Guide', 'subscribe-to-comment-notifications-comment-converter')}
						/>
					</a>
				</div>
			</div>
		</ShadowBox>
	);
};

Welcome.propTypes = {
	onDismiss: PropTypes.func.isRequired,
};
