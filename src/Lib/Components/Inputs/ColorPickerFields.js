import React from 'react';
import PropTypes from 'prop-types';
import isUndefined from 'lodash/isUndefined';
import styled from 'styled-components';
import { EditableInput } from 'react-color/lib/components/common';
import { hexToRgbA, isHex, percentToHex, isHexShorthand } from '../../util/hexColors';

// Hack alert....
// Need to use separate styled components to prevent
// issues with react not updating value state when the view switches.
const HexEditableInput = styled(EditableInput)``;
const RgbEditableInput = styled(EditableInput)``;
const HslEditableInput = styled(EditableInput)``;

const EditableInputWrapper = styled.div`
	label {
		margin-top: 5px;
		font-size: 10px;
		font-weight: 500;
		color: #abb7ce;
		text-transform: uppercase;
		text-align: center;
		display: block;
	}
`;

const Wrapper = styled.div`
	display: flex;
	margin: 0px;
	padding: 0px;

	> div {
		margin: 0px 0px 0px 5px;
		padding: 0px;

		&:first-child {
			margin-left: 0px;
		}
	}

	input {
		border-radius: 4px;
		border: 1px solid #abb7ce;
		box-shadow: none;
		color: #60697a;
		font-size: 14px;
		font-weight: 500;
		font-family: inherit;
		height: auto;
		padding: 8px 5px;
		text-align: center;
		box-sizing: border-box;
		height: 30px;
		width: 100%;

		&:focus {
			outline-color: ${(props) => hexToRgbA('#087ce1', '0.25')};
			outline-width: 1px;
		}

		+ span {
			margin-top: 5px;
			font-size: 10px;
			font-weight: 500;
			color: #abb7ce;
			text-transform: uppercase;
			text-align: center;
			display: block;
		}
	}
`;

function ColorPickerFields(props) {
	const view = props.view || 'hex';

	/**
	 * Handles the change event for the input fields.
	 *
	 * @param {Object} data The updated data object.
	 * @param {Object} e    The event object.
	 *
	 * @return {void}
	 */
	const handleChange = (data, e) => {
		if (data.hex) {
			if (isHex(data.hex) && !isHexShorthand(data.hex, true)) {
				props.onChange(
					{
						hex: data.hex,
						source: 'hex',
					},
					e
				);
			}
		} else if (data.r || data.g || data.b) {
			props.onChange(
				{
					r: data.r || props.rgb.r,
					g: data.g || props.rgb.g,
					b: data.b || props.rgb.b,
					a: data.a || props.rgb.a,
					source: 'rgb',
				},
				e
			);
		} else if (data.a) {
			if (data.a < 0) {
				data.a = 0;
			} else if (data.a > 1) {
				data.a = 1;
			}

			props.onChange(
				{
					h: props.hsl.h,
					s: props.hsl.s,
					l: props.hsl.l,
					a: Math.round(data.a * 100) / 100,
					source: 'rgb',
				},
				e
			);
		} else if (data.h || data.s || data.l) {
			// Remove any occurances of '%'.
			if (typeof data.s === 'string' && data.s.includes('%')) {
				data.s = data.s.replace('%', '');
			}
			if (typeof data.l === 'string' && data.l.includes('%')) {
				data.l = data.l.replace('%', '');
			}

			// We store HSL as a unit interval so we need to override the 1 input to 0.01
			if (data.s === 1) {
				data.s = 0.01;
			} else if (data.l === 1) {
				data.l = 0.01;
			}

			props.onChange(
				{
					h: data.h || props.hsl.h,
					s: Number(!isUndefined(data.s) ? data.s : props.hsl.s),
					l: Number(!isUndefined(data.l) ? data.l : props.hsl.l),
					source: 'hsl',
				},
				e
			);
		}
	};

	let fields;
	if (view === 'hex') {
		const hexValue = props.hex + (props.hsl.a !== 1 ? percentToHex(props.hsl.a * 100) : '');
		fields = (
			<Wrapper>
				<EditableInputWrapper>
					<HexEditableInput label="hex" value={hexValue} onChange={handleChange} />
				</EditableInputWrapper>
			</Wrapper>
		);
	} else if (view === 'rgb') {
		fields = (
			<Wrapper>
				<EditableInputWrapper>
					<RgbEditableInput label="r" value={props.rgb.r} onChange={handleChange} />
				</EditableInputWrapper>
				<EditableInputWrapper>
					<RgbEditableInput label="g" value={props.rgb.g} onChange={handleChange} />
				</EditableInputWrapper>
				<EditableInputWrapper>
					<RgbEditableInput label="b" value={props.rgb.b} onChange={handleChange} />
				</EditableInputWrapper>
				<EditableInputWrapper>
					<RgbEditableInput label="a" value={props.rgb.a} arrowOffset={0.01} onChange={handleChange} />
				</EditableInputWrapper>
			</Wrapper>
		);
	} else if (view === 'hsl') {
		fields = (
			<Wrapper>
				<EditableInputWrapper>
					<HslEditableInput label="h" value={Math.round(props.hsl.h)} onChange={handleChange} />
				</EditableInputWrapper>
				<EditableInputWrapper>
					<HslEditableInput label="s" value={`${Math.round(props.hsl.s * 100)}%`} onChange={handleChange} />
				</EditableInputWrapper>
				<EditableInputWrapper>
					<HslEditableInput label="l" value={`${Math.round(props.hsl.l * 100)}%`} onChange={handleChange} />
				</EditableInputWrapper>
				<EditableInputWrapper>
					<HslEditableInput label="a" value={props.hsl.a} arrowOffset={0.01} onChange={handleChange} />
				</EditableInputWrapper>
			</Wrapper>
		);
	}

	return fields;
}

ColorPickerFields.propTypes = {
	hex: PropTypes.string,
	hsl: PropTypes.object,
	hsv: PropTypes.object,
	onChange: PropTypes.func.isRequired,
	rgb: PropTypes.object.isRequired,
	view: PropTypes.oneOf(['hex', 'rgb', 'hsl']),
};

export default ColorPickerFields;
