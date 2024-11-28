import React from 'react';
import PropTypes from 'prop-types';
import IconSVGBase from './IconSVGBase';

// Custom Icon from Jonathan - Figma - Sidebar Design (https://www.figma.com/file/jgb45no8w8CXmLzUIaU73e/OM-Side-Panel-Simplification-(Finals))

function IconClose(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 512 512">
			<path
				d="M512 51.57L460.43 0 256 204.43 51.57 0 0 51.57 204.43 256 0 460.43 51.57 512 256 307.57 460.43 512 512 460.43 307.57 256 512 51.57z"
				fill={fill}
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

export default IconClose;
