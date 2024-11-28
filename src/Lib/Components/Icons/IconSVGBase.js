import React from 'react';
import PropTypes from 'prop-types';

/**
 * Helper function to set ARIA attributes.
 *
 * This only sets attributes when necessary.
 *
 * @param {boolean} ariaHidden The `ariaHidden` value.
 * @param {string}  ariaLabel  The `ariaLabel` value.
 *
 * @return {Object} The ARIA props.
 */
const getAriaProps = (ariaHidden, ariaLabel) => {
	const aria = {};

	if (ariaHidden) {
		aria['aria-hidden'] = 'true';
	}

	if (ariaLabel !== '') {
		aria['aria-label'] = ariaLabel;
	}

	return aria;
};

function IconSVGBase(props) {
	const { ariaHidden = true, ariaLabel = '', height = 30, width = 30, ...rest } = props;

	return (
		<svg
			height={height}
			version="1.1"
			width={width}
			xmlns="http://www.w3.org/2000/svg"
			{...getAriaProps(ariaHidden, ariaLabel)}
			{...rest}
		/>
	);
}

IconSVGBase.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	children: PropTypes.node.isRequired,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	viewBox: PropTypes.string.isRequired,
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default IconSVGBase;
