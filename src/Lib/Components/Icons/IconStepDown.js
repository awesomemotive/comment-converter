import React from 'react';
import PropTypes from 'prop-types';
import IconSVGBase from './IconSVGBase';

// Custom Icon from Jonathan - Figma - Sidebar Design (https://www.figma.com/file/jgb45no8w8CXmLzUIaU73e/OM-Side-Panel-Simplification-(Finals))

function IconStepDown(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 872 512">
			<path
				d="M135.15 22.74l301.68 301.68L738.51 22.74a77.43 77.43 0 01109.63 0 77.43 77.43 0 010 109.63L491.26 489.26a77.43 77.43 0 01-109.63 0L24.74 132.37a77.44 77.44 0 010-109.63c30.33-29.54 80.09-30.32 110.41 0z"
				fill={fill}
			/>
		</IconSVGBase>
	);
}

IconStepDown.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default IconStepDown;
