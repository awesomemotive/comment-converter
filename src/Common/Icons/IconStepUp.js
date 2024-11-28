import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconStepUp(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 25 25">
			<path
				d="M7.97836 16.6738L12.5684 12.0938L17.1584 16.6738L18.5684 15.2638L12.5684 9.26383L6.56836 15.2638L7.97836 16.6738Z"
				fill={fill}
			/>
		</IconSVGBase>
	);
}

IconStepUp.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
