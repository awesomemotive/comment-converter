import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Hide only visually, but have it available for screen readers:
 * https://snook.ca/archives/html_and_css/hiding-content-for-accessibility
 *
 * 1. For long content, line feeds are not interpreted as spaces and small width
 *    causes content to wrap 1 word per line:
 *    https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
 */
const Wrapper = styled.span`
	border: 0;
	clip: rect(0, 0, 0, 0);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	white-space: nowrap; /* 1 */
	width: 1px;
`;

export function VisuallyHidden(props) {
	return <Wrapper>{props.children}</Wrapper>;
}

VisuallyHidden.propTypes = {
	children: PropTypes.node,
};
