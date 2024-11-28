import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconWarning(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 14 12">
			<path
				fill={fill}
				fillRule="evenodd"
				d="M.8536 11.6982H12.584c.4874 0 .7913-.5255.5507-.9496L7.2663.6199c-.2469-.4241-.8546-.4241-1.0951 0L.3029 10.7486c-.2406.4241.0633.9496.5507.9496ZM7.355 9.799H6.0889V8.533h1.266v1.266ZM6.0889 6.6338c0 .3482.2849.633.633.633.3482 0 .633-.2848.633-.633v-1.266c0-.3483-.2848-.6331-.633-.6331-.3481 0-.633.2848-.633.633v1.2661Z"
				clipRule="evenodd"
			/>
		</IconSVGBase>
	);
}

IconWarning.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
