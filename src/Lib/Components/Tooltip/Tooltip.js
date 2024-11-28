import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tippy from '@tippyjs/react';

const StyledTippy = styled(Tippy)`
	background: #1d7fde;
	border-radius: 2px;
	color: #fff;
	padding: 5px;

	.tippy-content {
		font-size: 12px;
		text-align: center;
	}
`;

/**
 * A Tippy-based tooltip component.
 *
 * {@link https://github.com/atomiks/tippyjs-react}
 * {@link https://atomiks.github.io/tippyjs/}
 * {@link https://popper.js.org}
 *
 * @param {Object} props The props object.
 *
 * @return {Element} The tooltip.
 */
export function Tooltip(props) {
	const { children, offset, ...rest } = props;

	// Workaround for a bug in the Tippy.js React library.
	// See https://github.com/awesomemotive/optin-monster-support/issues/460
	// See https://github.com/atomiks/tippyjs-react/issues/247
	// TODO: Monitor GitHub for a fix, and remove this code.
	if (rest.singleton !== undefined && rest.disabled) {
		return <Fragment>{children}</Fragment>;
	}

	return (
		<StyledTippy offset={offset ? offset : [0, 5]} {...rest}>
			{children}
		</StyledTippy>
	);
}

Tooltip.propTypes = {
	children: PropTypes.node,
	offset: PropTypes.array,
	placement: PropTypes.string,
};
