import React from 'react';
import PropTypes from 'prop-types';
import IconSVGBase from './IconSVGBase';

// Custom Icon from Jonathan - Figma - Sidebar Design (https://www.figma.com/file/jgb45no8w8CXmLzUIaU73e/OM-Side-Panel-Simplification-(Finals))

function IconStepUp(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 872 512">
			<path
				d="M737.73 489.26L436.05 187.58 134.37 489.26a77.43 77.43 0 01-109.63 0 77.43 77.43 0 010-109.63L381.63 22.74a77.43 77.43 0 01109.63 0l356.88 356.89a77.44 77.44 0 010 109.63c-30.32 29.54-80.08 30.32-110.4 0z"
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

export default IconStepUp;
