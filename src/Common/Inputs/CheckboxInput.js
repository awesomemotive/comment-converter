import React from '@wordpress/element';
import styled from 'styled-components';
import tw from 'twin.macro';
import { CheckboxInputBase } from '../../Lib/Components/Inputs/CheckboxInputBase';

const StyledCheckboxInput = styled(CheckboxInputBase)`
	${tw`cursor-pointer`};

	& > span {
		${tw`text-sm font-normal text-primaryText100`};
	}

	input {
		${tw`bg-white border rounded border-neutral60`};
		${tw`w-4 h-4`};

		${tw`relative`};
		${tw`m-0 mr-2.5 rtl:!mr-0 rtl:ml-2.5`};

		${tw`cursor-pointer`};
		${tw`appearance-none`};
		${tw`align-top`};

		&:after {
			content: '';
			${tw`absolute block`};

			${tw`w-[5px] h-[9px]`};
			${tw`left-[5px] top-[1.5px]`};

			${tw`border-2 border-t-0 border-l-0 border-white rounded-[1.5px]`};

			${tw`rotate-45`};

			${tw`opacity-0`};
		}

		&:checked {
			${tw`bg-primaryBlue border-primaryBlue`};

			&:after {
				${tw`opacity-100`};
			}
		}
	}

	&:hover:not(.CheckboxInput--disabled) {
		input {
			${tw`border-primaryBlue`};
		}
	}
`;

export function CheckboxInput(props) {
	return <StyledCheckboxInput {...props} />;
}

CheckboxInput.propTypes = {
	...CheckboxInputBase.propTypes,
};
