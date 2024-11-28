import React from '@wordpress/element';
import styled from 'styled-components';
import tw from 'twin.macro';
import { FileInputBase } from '../../Lib/Components/Inputs/FileInputBase';
import { SecondaryButton } from '../Buttons/BaseButton';

const StyledFileInput = styled(FileInputBase)`
	& > span {
		${tw`text-primaryText text-sm font-bold`};
	}

	.FileInput--input-wrapper {
		gap: 10px;

		& > span {
			${tw`text-primaryText100 text-xs italic`};
		}
	}
`;

export function FileInput(props) {
	return <StyledFileInput {...props} ButtonComponent={SecondaryButton} />;
}

FileInput.propTypes = {
	...FileInputBase.propTypes,
};
