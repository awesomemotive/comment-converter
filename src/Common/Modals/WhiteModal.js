import tw from 'twin.macro';
import { WhiteModal as WhiteModalBase } from '../../Lib/Components/Modals/WhiteModal';
import { appId } from '../../data';
import styled from 'styled-components';

const StyledWhiteModal = styled(WhiteModalBase)`
	.Modal__Content--header {
		${tw`h-6 px-[30px] pt-6 pb-0`}

		.Modal__Content--header-close svg {
			${tw`w-3 h-3`}
		}
	}

	.Modal__Content--content {
		${tw`px-[30px] pt-0 pb-6`}
		${tw`text-base text-primaryText100`}

		.Modal__Content--content-title-wrapper {
			${tw`items-center`}

			.Modal__Content--content-title {
				${tw`text-xl font-bold text-primaryText`}
			}
		}

		.ConfirmationModal__ActionButtons {
			${tw`mt-4`}
		}
	}
`;

export function WhiteModal(props) {
	return <StyledWhiteModal parentSelector={() => document.querySelector(`#${appId}`)} {...props} />;
}
