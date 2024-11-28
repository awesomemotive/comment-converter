import React from '@wordpress/element';
import PropTypes from 'prop-types';
import IconSVGBase from '../../Lib/Components/Icons/IconSVGBase';

export default function IconLightbulb(props) {
	const { fill = 'currentColor', ...rest } = props;

	return (
		<IconSVGBase {...rest} viewBox="0 0 15 20">
			<g clipPath="url(#a)">
				<path
					fill={fill}
					d="M7.78 3.13a3.75 3.75 0 0 0-3.75 3.75.62.62 0 1 0 1.25 0 2.5 2.5 0 0 1 2.5-2.5.62.62 0 1 0 0-1.25Zm-3.12 14.8c0 .13.04.25.1.35l.96 1.44c.12.17.31.28.52.28h3.08c.21 0 .4-.1.52-.28l.96-1.44c.07-.1.1-.22.1-.34v-1.69H4.67v1.69ZM7.78 0a6.85 6.85 0 0 0-5.17 11.4c.65.74 1.67 2.3 2.05 3.6h1.87c0-.2-.03-.38-.08-.55-.22-.7-.9-2.53-2.43-4.29a4.98 4.98 0 0 1 3.76-8.29 5 5 0 0 1 3.77 8.3 12.35 12.35 0 0 0-2.43 4.27c-.06.18-.09.37-.09.56h1.88c.38-1.3 1.4-2.86 2.05-3.6A6.88 6.88 0 0 0 7.79 0Z"
				/>
			</g>
			<defs>
				<clipPath id="a">
					<path fill={fill} d="M.9 0h13.76v20H.9z" />
				</clipPath>
			</defs>
		</IconSVGBase>
	);
}

IconLightbulb.propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	fill: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
