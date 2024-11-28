import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconLifeRing(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 20 20">
			<path
				fill={fill}
				d="M9.78 19.69A9.69 9.69 0 1 0 9.78.3a9.69 9.69 0 0 0 0 19.38Zm-4.04-3 2.09-2.09c1.24.53 2.66.53 3.9 0l2.1 2.1a7.83 7.83 0 0 1-8.09 0ZM12.91 10a3.13 3.13 0 1 1-6.26 0 3.13 3.13 0 0 1 6.26 0Zm3.56 4.04-2.08-2.09a5.01 5.01 0 0 0 0-3.9l2.08-2.09a7.83 7.83 0 0 1 0 8.08ZM13.82 3.3 11.73 5.4a5.01 5.01 0 0 0-3.9 0L5.74 3.3a7.83 7.83 0 0 1 8.08 0ZM3.1 5.96l2.09 2.09a5.01 5.01 0 0 0 0 3.9l-2.09 2.09a7.83 7.83 0 0 1 0-8.08Z"
			/>
		</IconSVGBase>
	);
}

IconLifeRing.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
