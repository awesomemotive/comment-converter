import React from '@wordpress/element';
import styled from 'styled-components';
import tw from 'twin.macro';
import ColorInputBase from '../../Lib/Components/Inputs/ColorInputBase';
import { TextInput } from './TextInput';

const StyledColorInput = styled(ColorInputBase)`
	${tw`w-[122px]`};

	& > span {
		${tw`text-sm font-bold text-primaryText`};
	}

	input {
		${tw`text-xs`};
		${tw`!pl-[40px]`};
	}

	.ColorInput--swatch {
		${tw`border rounded border-neutral60`};
		${tw`w-6 h-6`};
		${tw`top-[5px] left-[6px]`};
	}
`;

export function ColorInput(props) {
	return <StyledColorInput {...props} TextInputComponent={TextInput} />;
}

ColorInput.propTypes = {
	...ColorInputBase.propTypes,
};
