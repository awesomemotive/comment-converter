import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { ShadowBox } from '../../../../Common/Layout/ShadowBox';
import missingDataImgSrc from '../../../../../assets/dashboard/missing-data.png';
import { TextLink } from '../../../../Common/Buttons/BaseButton';

export const MissingData = () => {
	const type = 'checkpoints';

	const wrapperClass = classNames(
		'justify-center items-center text-center',
		type === 'checkpoints' ? 'py-9' : 'py-12'
	);

	const missingDataImgClass = classNames(type === 'checkpoints' ? 'mb-[18px]' : 'mb-[11px]');

	const infoTextClass = classNames(
		'w-[500px] text-primaryText100 text-base leading-6 font-normal',
		type === 'checkpoints' ? 'mb-[21px]' : 'mb-[11px]'
	);

	const listClass = classNames(
		'list-disc marker:text-primaryBlue',
		type === 'checkpoints' ? 'mb-[56px]' : 'mb-[64px]'
	);

	return (
		<ShadowBox className={wrapperClass}>
			<div className="flex flex-col px-[30px] py-0 justify-center items-center">
				<img
					alt="Missing data illustration"
					className={missingDataImgClass}
					height="154"
					src={missingDataImgSrc}
					width="197"
				/>
				<h2 className="text-primaryText text-[28px] font-bold tracking-[-0.03em] mb-4">
					{__('Where’s all the data?', 'comment-notifications')}
				</h2>
				<p className="w-[500px] text-primaryText100 text-xl leading-7 font-normal mb-4">
					{__(
						'As you grow your followers, this dashboard will fill with proof of your growth.',
						'comment-notifications'
					)}
				</p>
				<hr className="border border-neutral40 w-[510px] mb-4" />
				<p className={infoTextClass}>
					{__(
						'Here are a few ways you can take action on getting your first follower today:',
						'comment-notifications'
					)}
				</p>
				<ul className={listClass}>
					<li>
						<TextLink
							className="underline"
							href="https://commentconverter.com/how-to-get-wordpress-comments/?utm_source=plugin&utm_medium=dashboard&utm_campaign=new_user"
							target="_blank"
							rel="noopener noreferrer"
						>
							{__('How To Get WordPress Comments', 'comment-notifications')}
						</TextLink>
					</li>
					<li>
						<TextLink
							className="underline"
							href="https://commentconverter.com/is-blog-commenting-still-effective?utm_source=plugin&utm_medium=dashboard&utm_campaign=new_user"
							target="_blank"
							rel="noopener noreferrer"
						>
							{__('Is Commenting Still Effective?', 'comment-notifications')}
						</TextLink>
					</li>
					<li>
						<TextLink
							className="underline"
							href="https://commentconverter.com/the-experts-guide-to-getting-more-blog-comments?utm_source=plugin&utm_medium=dashboard&utm_campaign=new_user/"
							target="_blank"
							rel="noopener noreferrer"
						>
							{__('The Experts Guide to Getting More Blog Comments', 'comment-notifications')}
						</TextLink>
					</li>
				</ul>
			</div>
		</ShadowBox>
	);
};
