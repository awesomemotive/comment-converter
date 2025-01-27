import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { IconLifeRing, IconLightbulb, IconLogoStroke } from '../../Common/Icons';
import * as urls from '../../utils/urls';
import classNames from 'classnames';

const links = [
	{
		title: __('Suggest a Feature', 'subscribe-to-comment-notifications-comment-converter'),
		url: urls.marketing('my-account/support/?topic=feature&utm_source=plugin&utm_medium=quicklinks'),
		IconComponent: IconLightbulb,
	},
	/*{
		title: __('Join Our Community', 'subscribe-to-comment-notifications-comment-converter'),
		url: 'https://www.facebook.com/groups/optinmonsterinnercircle/',
		IconComponent: IconComments,
	},*/
	{
		title: __('Support & Docs', 'subscribe-to-comment-notifications-comment-converter'),
		url: urls.marketing('docs/?topic=feature&utm_source=plugin&utm_medium=quicklinks'),
		IconComponent: IconLifeRing,
	},
];

export function QuickLinks() {
	const [open, setOpen] = useState(false);

	/**
	 * Handle the flyout button click.
	 */
	const handleFlyoutClick = () => {
		setOpen(!open);
	};

	const transitionClasses = 'transition-all duration-200 ease-in-out';

	const labelClasses = classNames(
		'absolute block top-1/2 right-[calc(100%+25px)]',
		'px-2 py-1.5 h-auto',
		'transform -translate-y-1/2',
		'text-white bg-primaryText whitespace-nowrap text-[12px] leading-none rounded-[3px]',
		transitionClasses
	);

	const flyoutButtonClasses = classNames(
		'ccvtr-flyout-button group',
		'cursor-pointer block bg-white rounded-full',
		'shadow-[0_4px_4px_0px_rgba(31,40,88,0.1)] hover:shadow-[0_4px_8px_0px_rgba(31,40,88,0.4)]',
		transitionClasses
	);

	const flyoutBtnLabelClasses = classNames(
		labelClasses,
		'right-[calc(100%+15px)]',
		'transform -translate-y-1/2 opacity-0 scale-0 -mr-12',
		'group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-1/2 group-hover:mr-0',
		'shadow-[0_2px_10px_0px_rgba(65,73,91,0.25)]',
		{
			hidden: open,
		}
	);

	return (
		<div id="ccvtr-flyout" className={`fixed z-[9998] right-10 bottom-10 opacity-100 ${transitionClasses}`}>
			<div id="ccvtr-flyout-items">
				{links.map(({ title, url, IconComponent }, i) => {
					const linkClasses = classNames(
						`ccvtr-flyout-item ccvtr-flyout-item-${i}`,
						'absolute h-10 w-10 left-[10px]',
						'flex items-center justify-center bg-primaryText hover:bg-primaryGreen rounded-full',
						transitionClasses,
						'opacity-0 invisible scale-0',
						{
							'opacity-100 !visible scale-100': open,
						}
					);

					return (
						<a
							key={title}
							href={url}
							className={linkClasses}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								...(open
									? {
											transition: `transform 0.2s ${i * 35}ms, background-color 0.2s`,
										}
									: {}),
								bottom: `${75 + i * 55}px`,
							}}
						>
							<div className={labelClasses}>{title}</div>
							<IconComponent width={20} height={20} className="text-white" />
						</a>
					);
				})}
			</div>
			<button className={flyoutButtonClasses} onClick={handleFlyoutClick}>
				<div className={flyoutBtnLabelClasses}>
					{__('See Quick Links', 'subscribe-to-comment-notifications-comment-converter')}
				</div>
				<IconLogoStroke width={60} height={60} />
			</button>
		</div>
	);
}
