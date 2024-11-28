import React from '@wordpress/element';
import styled from 'styled-components';
import tw from 'twin.macro';
import { RadioButtonInputBase } from '../../Lib/Components/Inputs/RadioButtonInputBase';

const StyledRadioButtonInput = styled(RadioButtonInputBase)`
	${tw`cursor-pointer`};

	& > span {
		${tw`text-sm font-normal text-primaryText100`};
	}

	input {
		${tw`bg-white border rounded-full border-neutral60`};
		${tw`w-4 h-4`};

		${tw`flex items-center justify-center`};
		${tw`m-0 mr-2.5 rtl:!mr-0 rtl:ml-2.5`};

		${tw`cursor-pointer`};
		${tw`appearance-none`};

		// Remove the :before to resolve a conflict with WP Core forms.css
		&:before {
			content: none;
		}

		&:after {
			content: '';

			${tw`h-2.5 w-2.5`};
			${tw`rounded-full bg-primaryBlue`};
			${tw`opacity-0`};
		}

		&:checked {
			${tw`border-primaryBlue`};

			&:after {
				${tw`opacity-100`};
			}
		}
	}

	&:hover:not(.RadioButtonInput--disabled) {
		input {
			${tw`border-primaryBlue`};
		}
	}
`;

export function RadioButtonInput(props) {
	return <StyledRadioButtonInput {...props} />;
}

RadioButtonInput.propTypes = {
	...RadioButtonInputBase.propTypes,
};
