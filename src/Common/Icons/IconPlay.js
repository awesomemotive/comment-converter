import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconFill(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 64 64">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M32 0C14.336 0 0 14.336 0 32C0 49.664 14.336 64 32 64C49.664 64 64 49.664 64 32C64 14.336 49.664 0 32 0ZM28.1596 44.4797L43.1036 33.2797C43.9676 32.6397 43.9676 31.3597 43.1036 30.7197L28.1596 19.5197C27.1036 18.7197 25.5996 19.4877 25.5996 20.7997V43.1997C25.5996 44.5117 27.1036 45.2797 28.1596 44.4797ZM6.40039 31.9997C6.40039 46.1117 17.8884 57.5997 32.0004 57.5997C46.1124 57.5997 57.6004 46.1117 57.6004 31.9997C57.6004 17.8877 46.1124 6.39974 32.0004 6.39974C17.8884 6.39974 6.40039 17.8877 6.40039 31.9997Z"
				fill={fill}
			/>
		</IconSVGBase>
	);
}

IconFill.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
