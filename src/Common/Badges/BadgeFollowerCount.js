import { IconPerson } from '../../Common/Icons';
import classNames from 'classnames';

export function BadgeFollowerCount(props) {
	const { children } = props;

	const wrapperClass = classNames(
		'flex items-center bg-neutral30 text-primaryText text-[14px] leading-[12px] py-[5px] px-[8px] rounded-sm font-bold'
	);

	return (
		<div className={wrapperClass}>
			<IconPerson width="20" height="20" className="!mr-[5px] rtl:!mr-0 rtl:ml-[3px]" />
			{children}
		</div>
	);
}
