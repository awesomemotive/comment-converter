import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconCheck2(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 14 10">
			<path
				fill={fill}
				fillRule="evenodd"
				d="M11.7998.8068a.75.75 0 0 1 1.0606 1.0607L5.1811 9.5467a.7481.7481 0 0 1-.5718.2185.7474.7474 0 0 1-.5076-.2193L.3349 5.7792a.75.75 0 1 1 1.0606-1.0607l3.2463 3.2463 7.158-7.158Z"
				clipRule="evenodd"
			/>
		</IconSVGBase>
	);
}

IconCheck2.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
