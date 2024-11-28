import { ArrowTooltip } from '../../Lib/Components/Tooltip/ArrowTooltip';
import tw from 'twin.macro';
import styled from 'styled-components';

const StyledTooltip = styled(ArrowTooltip)`
	${tw`bg-primaryText text-white rounded-[3px]`}

	.tippy-svg-arrow > svg {
		${tw`text-primaryText`}
	}
`;

export function Tooltip(props) {
	return <StyledTooltip appendTo="parent" offset={[0, 10]} {...props} />;
}
