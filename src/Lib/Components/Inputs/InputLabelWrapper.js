import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { VisuallyHidden } from '../VisuallyHidden';

const StyledSpan = styled.span``;

export function InputLabelWrapper(props) {
	const { labelHidden, ...rest } = props;
	const tag = labelHidden ? VisuallyHidden : 'span';

	return <StyledSpan as={tag} {...rest} />;
}

InputLabelWrapper.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	labelHidden: PropTypes.bool,
};
