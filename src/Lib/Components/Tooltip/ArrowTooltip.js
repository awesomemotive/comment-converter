import React from 'react';
import styled from 'styled-components';
import { Tooltip } from './Tooltip';
import 'tippy.js/dist/svg-arrow.css';

const arrow =
	'<svg width="16" height="6" viewBox="0 0 16 6" xmlns="http://www.w3.org/2000/svg"><path d="M2 6l4.5-4.4c.83-.8 2.17-.8 3 0L14 6H2z" fill="currentColor"/></svg>';

const StyledTooltip = styled(Tooltip)`
	.tippy-svg-arrow > svg {
		color: #1d7fde;
	}
`;

export function ArrowTooltip(props) {
	return <StyledTooltip arrow={arrow} {...props} />;
}
