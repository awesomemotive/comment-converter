import { HelpTip as HelpTipBase } from '../../Lib/Components/Tooltip/HelpTip';
import tw from 'twin.macro';
import styled from 'styled-components';

const StyledHelpTip = styled(HelpTipBase)`
	.tippy-box {
		${tw`bg-neutral100`}
	}

	.HelpTip--iconWrapper {
		svg {
			${tw`text-neutral60`}
		}
	}
`;

export function HelpTip(props) {
	return <StyledHelpTip {...props} />;
}
