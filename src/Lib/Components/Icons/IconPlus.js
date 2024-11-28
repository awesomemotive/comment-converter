import React from 'react';
import PropTypes from 'prop-types';
import IconSVGBase from './IconSVGBase';

// Custom Icon from Jonathan - Figma - Display Rules (https://www.figma.com/file/eaHLohmK64ZndCLnGPergz/OM-Display-Rules-(FINALS))

function IconPlus(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 512 512">
			<path
				d="M256 0a48 48 0 0 0-48 48v160H48a48 48 0 1 0 0 96h160v160a48 48 0 1 0 96 0V304h160a48 48 0 1 0 0-96H304V48a48 48 0 0 0-48-48Z"
				fill={fill}
			/>
		</IconSVGBase>
	);
}

IconPlus.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default IconPlus;
