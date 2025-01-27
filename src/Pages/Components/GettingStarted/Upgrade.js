import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { PrimaryButton } from '../../../Common/Buttons/BaseButton';
import { IconCheck } from '../../../Common/Icons';
import { ShadowBox } from '../../../Common/Layout/ShadowBox';
import { upgrade } from '../../../utils/urls';

export const Upgrade = (props) => {
	const { features, title } = props;

	return (
		<ShadowBox className="!bg-primaryText300">
			<div className="flex justify-between w-full py-10 px-[60px]">
				<div className="flex flex-col mr-5">
					<h2 className="text-left text-white text-[26px] leading-[34px] mb-8 font-bold">{title}</h2>

					{features && features.length > 0 && (
						<ul className="flex justify-between flex-wrap text-left gap-x-[20px] gap-y-[10px]">
							{features.map((featureTitle, index) => (
								<li
									key={index}
									className="flex items-center text-base leading-[21px] font-bold min-w-[250px] max-w-[calc(50%-10px)] text-white mb-0"
								>
									<IconCheck className="inline-flex mr-2 text-[#16B45E]" width="15" height="12" />
									{featureTitle}
								</li>
							))}
						</ul>
					)}
					<em className="text-neutral50 italic text-[12px] mt-[18px]">
						*{__('Coming Soon', 'subscribe-to-comment-notifications-comment-converter')}
					</em>
				</div>

				<div className="flex flex-col min-w-[235px] justify-center">
					{/* <h3 className="text-white text-base font-bold mt-[42px] mb-[26px]">PRO</h3>

					<div className="flex items-start justify-center mb-2 text-white">
						<span className="text-lg font-normal leading-none">$</span>

						<!-- Hardcoded leading(line-height) so the value is vertically aligned with the $ sign. -->
						<span className="text-[64px] leading-[50px] font-bold">39</span>
					</div>

					<p className="text-sm font-normal text-white">{__('per year', 'subscribe-to-comment-notifications-comment-converter')}</p> */}

					<PrimaryButton
						as="a"
						className="px-[28px]"
						href={upgrade({
							utmMedium: 'upgradedashboard',
						})}
						rel="noopener noreferrer"
						size="xlarge"
						target="_blank"
					>
						{__('Join the Pro Waitlist', 'subscribe-to-comment-notifications-comment-converter')}
					</PrimaryButton>
				</div>
			</div>
		</ShadowBox>
	);
};

Upgrade.propTypes = {
	features: PropTypes.arrayOf(PropTypes.string.isRequired),
	title: PropTypes.string.isRequired,
};
