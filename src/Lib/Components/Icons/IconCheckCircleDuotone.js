import React from 'react';
import PropTypes from 'prop-types';
import IconSVGBase from './IconSVGBase';

// Custom Icon from Jonathan based on Font Awesome 4.7: check

function IconCheckCircleDuotone(props) {
	const { fill = 'currentColor', iconFill = '#fff', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 512 512">
			<path
				d="M256 0c141.29 0 256 114.71 256 256 0 141.29-114.71 256-256 256C114.71 512 0 397.29 0 256 0 114.71 114.71 0 256 0zm135.97 192.52a17 17 0 00-4.91-11.93l-23.86-23.85a17.02 17.02 0 00-11.93-4.9c-4.39 0-8.78 1.74-11.93 4.9l-115.1 115.22-51.58-51.73a17.02 17.02 0 00-11.93-4.92c-4.38 0-8.77 1.76-11.93 4.91l-23.86 23.85a17 17 0 00-4.91 11.93 17 17 0 004.91 11.93l87.37 87.33a17.02 17.02 0 0011.93 4.9c4.4 0 8.78-1.74 11.94-4.9l150.88-150.82a17 17 0 004.91-11.92z"
				fill={fill}
			/>
			<path
				d="M391.97 192.52a17 17 0 00-4.91-11.93l-23.86-23.85a17.02 17.02 0 00-11.93-4.9c-4.39 0-8.78 1.74-11.93 4.9l-115.1 115.22-51.58-51.73a17.02 17.02 0 00-11.93-4.92c-4.38 0-8.77 1.76-11.93 4.91l-23.86 23.85a17 17 0 00-4.91 11.93 17 17 0 004.91 11.93l87.37 87.33a17.02 17.02 0 0011.93 4.9c4.4 0 8.78-1.74 11.94-4.9l150.88-150.82a17 17 0 004.91-11.92z"
				fill={iconFill}
			/>
		</IconSVGBase>
	);
}

IconCheckCircleDuotone.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	iconFill: PropTypes.string,
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default IconCheckCircleDuotone;
