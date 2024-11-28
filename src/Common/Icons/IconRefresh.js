import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconRefresh(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 11 14">
			<path
				fill={fill}
				fillRule="evenodd"
				d="M5.2698 4.3418V3.2115c-2.0898 0-3.7883 1.6984-3.7883 3.7883 0 .4988.0947.985.2778 1.4206.0947.2273.0253.4862-.1452.6567-.322.322-.865.2083-1.0355-.2147C.345 8.2879.2187 7.6565.2187 6.9999c0-2.7907 2.2604-5.0511 5.0511-5.0511V.8186c0-.2841.341-.423.5367-.2273L7.5681 2.353c.1263.1263.1263.322 0 .4483L5.8065 4.5627c-.1957.202-.5366.0632-.5366-.221Zm3.5105 1.2375c-.0947-.221-.0252-.4862.1453-.6567.322-.322.865-.2083 1.0354.2147.2336.5746.3599 1.206.3599 1.8626 0 2.7907-2.2603 5.0511-5.051 5.0511v1.1365c0 .2778-.341.4167-.5367.221l-1.7616-1.7616c-.1263-.1263-.1263-.322 0-.4483L4.7332 9.437c.1957-.202.5366-.063.5366.221v1.1302c2.09 0 3.7883-1.6984 3.7883-3.7883 0-.4988-.101-.9787-.2778-1.4206Z"
				clipRule="evenodd"
			/>
		</IconSVGBase>
	);
}

IconRefresh.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
