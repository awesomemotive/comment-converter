import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconPerson(props) {
	const { fill = 'transparent', stroke = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 12 13">
			<path
				d="M0.5 10.1473C0.5 9.18832 1.2682 8.37209 2.47419 7.76396C3.65557 7.16825 5.07863 6.87109 6 6.87109C6.92137 6.87109 8.34443 7.16825 9.52581 7.76396C10.7318 8.37209 11.5 9.18832 11.5 10.1473V11.0914C11.5 11.2453 11.4495 11.37 11.3882 11.4471C11.3273 11.5238 11.2745 11.5354 11.25 11.5354H0.75C0.725522 11.5354 0.672736 11.5238 0.611806 11.4471C0.55053 11.37 0.5 11.2453 0.5 11.0914V10.1473Z"
				fill={fill}
				stroke={stroke}
			/>
			<path
				d="M6 7.22266C7.6575 7.22266 9 5.88016 9 4.22266C9 2.56516 7.6575 1.22266 6 1.22266C4.3425 1.22266 3 2.56516 3 4.22266C3 5.88016 4.3425 7.22266 6 7.22266Z"
				fill={fill}
				stroke={stroke}
			/>
		</IconSVGBase>
	);
}

IconPerson.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
