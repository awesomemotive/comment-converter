import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { PrimaryButton } from '../../../../Common/Buttons/BaseButton';
import smallUpsellImgSrc from '../../../../../assets/dashboard/upsell-small.png';
import largeUpsellImgSrc from '../../../../../assets/dashboard/upsell-large.png';
import { ShadowBox } from '../../../../Common/Layout/ShadowBox';
import { upgrade } from '../../../../utils/urls';

const wrapperConfig = {
	small: '',
	large: 'px-[26px] justify-between',
};

const contentWrapperConfig = {
	small: 'flex-col p-[22px] pl-0 rtl:!pl-[22px] rtl:!pr-[22px]',
	large: 'flex-row justify-between items-center ml-[13px] rtl:!ml-0 rtl:mr-[13px]',
};

const headingSizeConfig = {
	small: 'text-base leading-[19px] mb-[7px]',
	large: 'text-xl leading-[30px]',
};

const paragraphSizeConfig = {
	small: 'text-xs leading-4 mb-[7px]',
	large: 'text-[15px] leading-[22px]',
};

const buttonSizeConfig = {
	small: '!text-base !py-[7px] !px-[17px]',
	large: '!text-[18px] !py-[13px] !px-[29px]',
};

export const Upsell = ({ size }) => {
	const wrapperClass = classNames(
		'!bg-primaryYellow50 border border-primaryYellow300 flex !flex-row py-0 px-0 w-full items-center',
		wrapperConfig[size]
	);

	const contentWrapperClass = classNames('flex w-full', contentWrapperConfig[size]);

	const headingClass = classNames('text-primaryText ccvtr-quicksand font-bold', headingSizeConfig[size]);

	const paragraphClass = classNames('text-primaryText ccvtr-quicksand font-medium', paragraphSizeConfig[size]);

	const buttonClass = classNames('ccvtr-quicksand !rounded-[6px] font-bold', buttonSizeConfig[size]);

	const UpsellIcon = (
		<img src={size === 'small' ? smallUpsellImgSrc : largeUpsellImgSrc} alt="Comments illustration" />
	);
	const buttonSize = size === 'small' ? 'medium' : 'large';

	return (
		<ShadowBox className={wrapperClass}>
			{UpsellIcon}

			<div className={contentWrapperClass}>
				<div>
					<h2 className={headingClass}>
						{
							/* translators: Comment Converter is the name of the plugin. */
							__('Turn Comment Followers into Subscribers With Comment Converter Pro.', 'comment-notifications')
						}
					</h2>
					<p className={paragraphClass}>
						{'small' === size
							? __('Effortlessly add commenters to your email marketing list.', 'comment-notifications')
							: __(
									'Effortlessly add commenters to your email marketing list to keep the conversation flowing.',
									'comment-notifications'
								)}
					</p>
				</div>
				<div className="flex items-align-start">
					<PrimaryButton
						as="a"
						className={buttonClass}
						href={upgrade({
							utmMedium: 'upselldashboard',
						})}
						rel="noopener noreferrer"
						size={buttonSize}
						target="_blank"
					>
						{__('Go Pro Today', 'comment-notifications')}
					</PrimaryButton>
				</div>
			</div>
		</ShadowBox>
	);
};

Upsell.propTypes = {
	size: PropTypes.oneOf(['small', 'large']).isRequired,
};
