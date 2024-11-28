import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconDuplicate(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 14 14">
			<path
				d="M13 12.75V4.25C13 4.11719 12.8828 4 12.75 4H4.25C4.11719 4 4 4.11719 4 4.25V12.75C4 12.8828 4.11719 13 4.25 13H12.75C12.8828 13 13 12.8828 13 12.75ZM14 4.25V12.75C14 13.4375 13.4375 14 12.75 14H4.25C3.5625 14 3 13.4375 3 12.75V4.25C3 3.5625 3.5625 3 4.25 3H12.75C13.4375 3 14 3.5625 14 4.25ZM11 1.25V2.5H10V1.25C10 1.11719 9.88281 0.999999 9.75 0.999999H1.25C1.11719 0.999999 1 1.11719 1 1.25V9.75C1 9.88281 1.11719 10 1.25 10H2.5V11H1.25C0.5625 11 0 10.4375 0 9.75V1.25C0 0.562499 0.5625 -9.53674e-07 1.25 -9.53674e-07H9.75C10.4375 -9.53674e-07 11 0.562499 11 1.25Z"
				fill={fill}
			/>
		</IconSVGBase>
	);
}

IconDuplicate.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
