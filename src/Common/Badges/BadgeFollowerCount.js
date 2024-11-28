import { IconPerson } from '../../Common/Icons';
import classNames from 'classnames';

export function BadgeFollowerCount(props) {
	const { children } = props;

	const wrapperClass = classNames(
		'flex items-center bg-neutral30 text-primaryText text-[12px] text-[12px] leading-[12px] p-[3px] rounded-sm font-bold'
	);

	return (
		<div className={wrapperClass}>
			<IconPerson width="12" height="12" className="!mr-[3px] rtl:!mr-0 rtl:ml-[3px]" />
			{children}
		</div>
	);
}
