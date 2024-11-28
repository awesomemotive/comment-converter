import { IconLogo } from '../../Common/Icons';
import classNames from 'classnames';

export function BadgeFollowCount(props) {
	const { children, className } = props;

	const wrapperClass = classNames(
		'flex items-center bg-primaryYellow hover:bg-neutral900 hover:text-white text-primaryText text-[12px] leading-[12px] p-[3px] rounded-sm font-bold',
		className
	);

	return (
		<div className={wrapperClass}>
			<IconLogo width="10" height="10" type="white" className="!mr-[3px] rtl:!mr-0 rtl:ml-[3px]" />
			{children}
		</div>
	);
}
