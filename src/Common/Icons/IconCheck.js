import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconCheck(props) {
	const { fill = 'currentColor', stroke = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 18 15">
			<path
				d="M5.69809 10.9667L2.59155 7.86232C2.42429 7.6948 2.19721 7.60065 1.9604 7.60065C1.72359 7.60065 1.49651 7.6948 1.32924 7.86232C0.980095 8.21123 0.980095 8.77485 1.32924 9.12375L5.07141 12.8633C5.42056 13.2122 5.98457 13.2122 6.33372 12.8633L15.8055 3.3981C16.1547 3.04919 16.1547 2.48557 15.8055 2.13667C15.6383 1.96914 15.4112 1.875 15.1744 1.875C14.9376 1.875 14.7105 1.96914 14.5432 2.13667L5.69809 10.9667Z"
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
			/>
		</IconSVGBase>
	);
}

IconCheck.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	stroke: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
