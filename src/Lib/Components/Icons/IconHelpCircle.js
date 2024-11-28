import React from 'react';
import PropTypes from 'prop-types';
import IconSVGBase from './IconSVGBase';

// Custom Icon from Jonathan - Figma - Sidebar Design (https://www.figma.com/file/jgb45no8w8CXmLzUIaU73e/OM-Side-Panel-Simplification-(Finals))

function IconHelpCircle(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 512 512">
			<path
				d="M256 0C114.69 0 0 114.69 0 256s114.69 256 256 256 256-114.69 256-256S397.31 0 256 0zm-25.61 409.6h51.2v-51.2h-51.2v51.2zM153.6 204.8c0-56.57 45.82-102.4 102.4-102.4 56.58 0 102.4 45.83 102.4 102.4 0 32.84-20.22 50.52-39.92 67.73-18.68 16.32-36.88 32.23-36.88 60.27h-51.2c0-46.62 24.12-65.1 45.32-81.36 16.64-12.75 31.48-24.13 31.48-46.64 0-28.16-23.04-51.2-51.2-51.2-28.16 0-51.2 23.04-51.2 51.2h-51.2z"
				fill={fill}
				fillRule="evenodd"
			/>
		</IconSVGBase>
	);
}

IconHelpCircle.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default IconHelpCircle;
