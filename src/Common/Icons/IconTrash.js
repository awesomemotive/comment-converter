import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconTrash(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 12 13">
			<path
				d="M4.46094 5.25V9.75C4.46094 9.89062 4.35156 10 4.21094 10H3.71094C3.57031 10 3.46094 9.89062 3.46094 9.75V5.25C3.46094 5.10937 3.57031 5 3.71094 5H4.21094C4.35156 5 4.46094 5.10937 4.46094 5.25ZM6.46094 5.25V9.75C6.46094 9.89062 6.35156 10 6.21094 10H5.71094C5.57031 10 5.46094 9.89062 5.46094 9.75V5.25C5.46094 5.10937 5.57031 5 5.71094 5H6.21094C6.35156 5 6.46094 5.10937 6.46094 5.25ZM8.46094 5.25V9.75C8.46094 9.89062 8.35156 10 8.21094 10H7.71094C7.57031 10 7.46094 9.89062 7.46094 9.75V5.25C7.46094 5.10937 7.57031 5 7.71094 5H8.21094C8.35156 5 8.46094 5.10937 8.46094 5.25ZM9.46094 10.9062V3.5H2.46094V10.9062C2.46094 11.2812 2.67188 11.5 2.71094 11.5H9.21094C9.25 11.5 9.46094 11.2812 9.46094 10.9062ZM4.21094 2.5H7.71094L7.33594 1.58594C7.3125 1.55469 7.24219 1.50781 7.20313 1.5H4.72656C4.67969 1.50781 4.61719 1.55469 4.59375 1.58594L4.21094 2.5ZM11.4609 2.75V3.25C11.4609 3.39062 11.3516 3.5 11.2109 3.5H10.4609V10.9062C10.4609 11.7656 9.89844 12.5 9.21094 12.5H2.71094C2.02344 12.5 1.46094 11.7969 1.46094 10.9375V3.5H0.710938C0.570312 3.5 0.460938 3.39062 0.460938 3.25V2.75C0.460938 2.60937 0.570312 2.5 0.710938 2.5H3.125L3.67188 1.19531C3.82813 0.8125 4.29688 0.499999 4.71094 0.499999H7.21094C7.625 0.499999 8.09375 0.8125 8.25 1.19531L8.79688 2.5H11.2109C11.3516 2.5 11.4609 2.60937 11.4609 2.75Z"
				fill={fill}
			/>
		</IconSVGBase>
	);
}

IconTrash.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};