import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconHelpOutline(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 24 24">
			<path
				fill={fill}
				fillRule="evenodd"
				d="M.61 12.4a11.52 11.52 0 1 1 23.05.02A11.52 11.52 0 0 1 .61 12.4Zm12.68 6.92h-2.3v-2.3h2.3v2.3Zm-1.16 2.3a9.23 9.23 0 0 1 0-18.43 9.23 9.23 0 0 1 0 18.43ZM7.53 10.1a4.6 4.6 0 1 1 9.21 0c0 1.48-.9 2.28-1.8 3.05-.83.74-1.65 1.45-1.65 2.71h-2.3c0-2.1 1.08-2.93 2.03-3.66.75-.57 1.42-1.08 1.42-2.1 0-1.26-1.04-2.3-2.3-2.3a2.31 2.31 0 0 0-2.31 2.3h-2.3Z"
				clipRule="evenodd"
			/>
		</IconSVGBase>
	);
}

IconHelpOutline.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
