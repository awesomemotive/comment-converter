import { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { IconStepUp } from '../Icons';
import { ShadowBox } from './ShadowBox';

export const Accordion = (props) => {
	const { children, title } = props;
	const [open, setOpen] = useState(true);

	/**
	 * Handles toggling the accordion.
	 */
	const handleClick = () => {
		setOpen(!open);
	};

	const toggleIconClass = classNames(
		'transition-transform duration-200 ease-in-out text-primaryText',
		open ? '' : 'rotate-180'
	);

	return (
		<ShadowBox>
			<button
				onClick={handleClick}
				className="w-full flex justify-between items-center border-b border-neutral40 px-[30px] pr-6 py-6"
			>
				<h2 className="text-primaryText text-base font-bold">{title}</h2>
				<IconStepUp width="24" height="24" className={toggleIconClass} />
			</button>
			{open ? <div className="w-full px-[30px] pt-6 pb-4">{children}</div> : null}
		</ShadowBox>
	);
};

Accordion.propTypes = {
	children: PropTypes.node,
	title: PropTypes.string.isRequired,
};
