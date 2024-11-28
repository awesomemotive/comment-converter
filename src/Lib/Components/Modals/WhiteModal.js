import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconClose } from '../Icons';
import Modal from './Modal';

const StyledModal = styled(Modal)`
	.Modal__Content--header {
		background-color: #fff;
		height: 40px;
		padding: 20px 20px 10px 20px;
		justify-content: flex-end;
	}

	.Modal__Content--header-close {
		color: #abb7ce;
		background-color: transparent;
		border: none;
		padding: 0px;

		svg {
			width: 14px;
			height: 14px;
		}
	}

	.Modal__Content--content {
		padding: 0 60px 40px 60px;
	}

	.Modal__Content {
		max-height: 80%;
		max-width: ${(props) => (props.width ? `${props.width}px` : '600px')};
		min-width: 500px;
		width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
	}
`;

const ContentTitle = styled.div`
	color: #41495b;
	fill: #41495b;
	font-size: 20px;
	font-weight: 700;
	margin-bottom: 16px;

	display: flex;
	align-items: flex-start;

	svg {
		width: 20px;
		height: 20px;
		margin-right: 5px;
	}
`;

export function WhiteModal(props) {
	const { children, title, titleIcon, ...rest } = props;

	return (
		<StyledModal {...rest} closeIcon={IconClose}>
			<Fragment>
				{!!title && (
					<ContentTitle className="Modal__Content--content-title-wrapper">
						{titleIcon} <span className="Modal__Content--content-title">{title}</span>
					</ContentTitle>
				)}
				{children}
			</Fragment>
		</StyledModal>
	);
}

WhiteModal.propTypes = {
	...Modal.propTypes,
	children: PropTypes.node.isRequired,
};
