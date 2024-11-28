import React from 'react';
import PropTypes from 'prop-types';
import IconSVGBase from './IconSVGBase';

function IconWarningTriangle(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 592 512">
			<path
				d="M247.06 27.87C257.25 10.62 276.06 0 296.43 0s39.17 10.62 49.35 27.87l150.18 254.41 86.25 146.1a54.69 54.69 0 0 1 0 55.75c-10.18 17.25-29 27.87-49.35 27.87H59.99c-20.36 0-39.18-10.63-49.36-27.87a54.7 54.7 0 0 1 0-55.75l148.43-251.43 88-149.08Zm18.5 113.25a31.99 31.99 0 0 0-1.38 13.24l12.37 165.12a19.55 19.55 0 0 0 38.9 0l12.37-165.12a31.99 31.99 0 0 0-62.26-13.24ZM296 372a32 32 0 1 0 0 64 32 32 0 0 0 0-64Z"
				fill={fill}
				fillRule="evenodd"
			/>
		</IconSVGBase>
	);
}

IconWarningTriangle.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default IconWarningTriangle;
