import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconClose2(props) {
	const { fill = 'currentColor', stroke = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 13 12">
			<path
				d="m11.5 2.171-1.007-1.007L6.5 5.157 2.507 1.164 1.5 2.171l3.993 3.993L1.5 10.157l1.007 1.007L6.5 7.171l3.993 3.993 1.007-1.007-3.993-3.993L11.5 2.171Z"
				fill={fill}
				stroke={stroke}
			/>
		</IconSVGBase>
	);
}

IconClose2.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
