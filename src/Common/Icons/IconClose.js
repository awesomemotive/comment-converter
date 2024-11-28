import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconClose(props) {
	const { fill = 'currentColor', stroke = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 8 9">
			<path
				d="M7 2.10429L6.39571 1.5L4 3.89571L1.60429 1.5L1 2.10429L3.39571 4.5L1 6.89571L1.60429 7.5L4 5.10429L6.39571 7.5L7 6.89571L4.60429 4.5L7 2.10429Z"
				fill={fill}
				stroke={stroke}
			/>
		</IconSVGBase>
	);
}

IconClose.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
