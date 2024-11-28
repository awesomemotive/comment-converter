import React from '@wordpress/element';
import styled from 'styled-components';
import tw from 'twin.macro';
import { TextListInputBase } from '../../Lib/Components/Inputs/TextListInputBase';
import { SecondaryButton } from '../Buttons/BaseButton';
import { TextInput } from './TextInput';
import { IconClose } from '../Icons';

const StyledTextListInput = styled(TextListInputBase)`
	& > span {
		${tw`text-primaryText text-sm font-bold`};
	}

	.TextListInput--list {
		gap: 10px;
	}

	.TextListInput--list-item {
		${tw`text-primaryText text-xs`};
		${tw`bg-neutral30 rounded-[3px]`};
		${tw`py-[5px] px-[7px]`};

		svg {
			${tw`w-2 h-2`};
		}
	}
`;

export function TextListInput(props) {
	return (
		<StyledTextListInput
			{...props}
			ButtonComponent={SecondaryButton}
			CloseIcon={IconClose}
			TextInputComponent={TextInput}
		/>
	);
}

TextListInput.propTypes = {
	...TextListInputBase.propTypes,
};
