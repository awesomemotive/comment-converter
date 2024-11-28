import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import tw from 'twin.macro';

const StyledBaseButton = styled.button`
	& > svg {
		${tw`w-[14px] h-[14px]`}
	}

	&.btn-small {
		& > svg {
			${tw`w-[12px] h-[12px]`}
		}
	}
`;

// Note: we add border to all sizes (even when the button doesn't show one) so we can have a consistent height across all sizes.
const btnSizeMap = {
	small: 'btn-small text-xs py-[7.5px] px-3.5 border', // Final Height: 30px = 13px (font-size) + 15px (padding top and bottom) + 2px (border top and bottom)
	medium: 'btn-medium text-base py-2 px-4 border', // Final Height: 34px = 16px (font-size) + 16px (padding top and bottom) + 2px (border top and bottom)
	large: 'btn-large text-xl py-[11px] px-4 border', // Final Height: 44px = 20px (font-size) + 22px (padding top and bottom) + 2px (border top and bottom)
	xlarge: 'btn-xlarge text-xl py-[15px] px-8 border', // Final Height: 52px = 20px (font-size) + 30px (padding top and bottom) + 2px (border top and bottom)
};

const lnkSizeMap = {
	small: 'lnk-small text-xs',
	medium: 'lnk-medium text-base',
	large: 'lnk-large text-xl',
};

export function BaseButton(props) {
	const { btnClassName, children, className, size = 'medium', ...rest } = props;
	const classes = classNames(
		'cursor-pointer flex flex-row rounded-[3px] items-center text-center justify-center !leading-none',
		btnSizeMap[size],
		btnClassName,
		className
	);

	return (
		<StyledBaseButton className={classes} {...rest}>
			{children}
		</StyledBaseButton>
	);
}

BaseButton.propTypes = {
	btnClassName: PropTypes.string,
	children: PropTypes.node,
	className: PropTypes.string,
	size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
};

export const PrimaryButton = (props) => {
	return (
		<BaseButton
			{...props}
			btnClassName="btn-primary text-white bg-primaryGreen border border-primaryGreen hover:bg-green200 hover:border-green200"
		/>
	);
};

export const SecondaryButton = (props) => {
	const { btnClassName, ...rest } = props;
	const classes = classNames(
		'btn-secondary text-primaryText bg-neutral20 border border-neutral80 hover:bg-white hover:border-primaryText',
		btnClassName
	);
	return <BaseButton {...rest} btnClassName={classes} />;
};

export const IconButton = (props) => {
	return <SecondaryButton {...props} btnClassName="btn-icon !py-2 !px-[11px]" />;
};

export const GreyButton = (props) => {
	return (
		<BaseButton
			{...props}
			btnClassName="btn-grey text-primaryText bg-neutral30 border border-neutral30 hover:bg-neutral40 hover:border-neutral40 !rounded"
		/>
	);
};

export const TextLinkButton = (props) => {
	const { children, className, size = 'medium', ...rest } = props;

	const classes = classNames(
		'btn-text-link',
		'flex flex-row text-primaryBlue hover:text-primaryBlue hover:underline cursor-pointer font-normal text-left',
		lnkSizeMap[size],
		className
	);

	return (
		<StyledBaseButton className={classes} {...rest}>
			{children}
		</StyledBaseButton>
	);
};

TextLinkButton.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export const TextLink = (props) => {
	return <TextLinkButton as={'a'} {...props} />;
};
