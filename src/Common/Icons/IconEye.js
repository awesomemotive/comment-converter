import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconEye(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 15 11">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.70833 0.886719C4.48864 0.886719 1.73902 2.88937 0.625 5.71626C1.73902 8.54316 4.48864 10.5458 7.70833 10.5458C10.928 10.5458 13.6777 8.54316 14.7917 5.71626C13.6777 2.88937 10.928 0.886719 7.70833 0.886719ZM7.70798 8.93549C5.93071 8.93549 4.48828 7.49306 4.48828 5.71579C4.48828 3.93852 5.93071 2.49609 7.70798 2.49609C9.48525 2.49609 10.9277 3.93852 10.9277 5.71579C10.9277 7.49306 9.48525 8.93549 7.70798 8.93549ZM5.77637 5.71697C5.77637 4.64803 6.63925 3.78516 7.70819 3.78516C8.77712 3.78516 9.64 4.64803 9.64 5.71697C9.64 6.78591 8.77712 7.64879 7.70819 7.64879C6.63925 7.64879 5.77637 6.78591 5.77637 5.71697Z"
				fill={fill}
			/>
		</IconSVGBase>
	);
}

IconEye.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
