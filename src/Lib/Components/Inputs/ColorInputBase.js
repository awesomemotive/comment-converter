import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputLabelWrapper } from './InputLabelWrapper';
import classnames from 'classnames';
import { TextInputBase } from './TextInputBase';
import { Checkboard } from 'react-color/lib/components/common';

const StyledLabel = styled.label`
	display: flex;

	&.ColorInput--label-top {
		flex-direction: column;
	}

	&.ColorInput--label-right,
	&.ColorInput--label-left {
		align-items: center;
	}

	&.ColorInput--label-right {
		flex-direction: row-reverse;
		justify-content: flex-end;
	}

	input {
		padding-left: 30px;
	}
`;

const ControlsWrapper = styled.div`
	position: relative;
	display: flex;
	align-items: center;
`;

const CurrentSwatch = styled.div`
	width: 24px;
	height: 24px;
	border-radius: 3px;

	position: relative;
	overflow: hidden;

	position: absolute;
	top: 3px;
	left: 3px;

	z-index: 1;
`;

const SwatchColor = styled.div`
	position: absolute;
	inset: 0px;
	border-radius: 3px;
	background: ${(props) => props.$color || 'transparent'};
	z-index: 2;
`;

function ColorInputBase(props) {
	const {
		TextInputComponent = TextInputBase,
		className,
		disabled,
		label,
		labelHidden,
		labelPosition,
		name,
		onChange,
		value,
	} = props;

	/**
	 * The `onChange` input callback.
	 *
	 * @param {Object} event The `onChange` event object.
	 *
	 * @param          value
	 * @return {void}
	 */
	const handleChange = (value) => {
		// Only allows HEX values characters
		const regex = /[^#a-fA-F0-9]/g;
		value = value.replace(regex, '');

		// Automatically add the '#' character if it's missing.
		if (value && '#' !== value[0]) {
			value = `#${value}`;
		}

		// Get only the equivalent of a HEX value (Ex.: #FFFFFF).
		onChange(value.substring(0, 7).toUpperCase(), name);
	};

	const classes = classnames(className, `ColorInput--label-${labelPosition || 'top'}`, {
		'ColorInput--disabled': disabled,
	});

	return (
		<StyledLabel className={classes}>
			<InputLabelWrapper labelHidden={labelHidden}>{label}</InputLabelWrapper>
			<ControlsWrapper className="ColorInput--controls">
				<CurrentSwatch className="ColorInput--swatch">
					{/* Ref.: https://styled-components.com/docs/api#transient-props */}
					<SwatchColor $color={value} />
					<Checkboard />
				</CurrentSwatch>
				<TextInputComponent
					label="Color input"
					labelHidden={true}
					name="colorInput"
					onChange={handleChange}
					value={value}
				/>
			</ControlsWrapper>
		</StyledLabel>
	);
}

ColorInputBase.propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
	label: PropTypes.node.isRequired,
	labelHidden: PropTypes.bool,
	labelPosition: PropTypes.oneOf(['top', 'right', 'left']),
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	TextInputComponent: PropTypes.elementType,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ColorInputBase;
