import React from 'react';
import PropTypes from 'prop-types';
import { IconHelpCircle } from '../Icons';
import { Tooltip } from './Tooltip';
import styled from 'styled-components';

const Wrapper = styled.span`
	display: flex;
	align-items: center;
`;

const IconWrapper = styled.span`
	${(props) => props.$hasChildren && 'margin-left: 5px;'}

	svg {
		color: #abb7ce;
		display: block;
	}
`;

const StyledTooltip = styled(Tooltip)`
	padding: 8px 16px;

	a {
		text-decoration: underline;
		color: #fff;
	}
`;

export function HelpTip(props) {
	const { children, className, ...rest } = props;

	return (
		<Wrapper className={className}>
			{children}
			<StyledTooltip interactive={true} {...rest}>
				{/* Ref.: https://styled-components.com/docs/api#transient-props */}
				<IconWrapper className="HelpTip--iconWrapper" $hasChildren={!!children}>
					<IconHelpCircle height={15} width={15} />
				</IconWrapper>
			</StyledTooltip>
		</Wrapper>
	);
}

HelpTip.propTypes = {
	children: PropTypes.node,
	offset: PropTypes.array,
};
