import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconComments(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 21 17">
			<path
				fill={fill}
				d="M7.28 11.5c3.6 0 6.5-2.46 6.5-5.5S10.88.5 7.28.5C3.7.5.78 2.96.78 6c0 1.2.46 2.32 1.24 3.23-.1.3-.27.55-.44.77a3.58 3.58 0 0 1-.59.6.5.5 0 0 0-.18.55c.07.2.26.35.47.35a5.65 5.65 0 0 0 2.73-.75c.96.48 2.08.75 3.27.75Zm7.5-5.5c0 3.51-3.1 6.15-6.76 6.47.76 2.32 3.28 4.03 6.26 4.03 1.2 0 2.31-.27 3.28-.75a5.65 5.65 0 0 0 2.73.75.5.5 0 0 0 .29-.9v-.01a2.02 2.02 0 0 1-.17-.14 3.59 3.59 0 0 1-.87-1.22A4.94 4.94 0 0 0 20.78 11c0-2.9-2.65-5.28-6.02-5.49l.02.49Z"
			/>
		</IconSVGBase>
	);
}

IconComments.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
