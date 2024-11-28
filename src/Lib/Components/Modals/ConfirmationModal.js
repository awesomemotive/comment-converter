import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { WhiteModal } from './WhiteModal';
import Modal from './Modal';

const MessageWrapper = styled.div`
	color: #60697a;
	font-size: 17px;
	line-height: 1.5;
	font-weight: 400;
`;

const FooterWrapper = styled(MessageWrapper)`
	font-size: 16px;
	margin-top: 20px;
`;

const ActionButtons = styled.div`
	margin-top: 20px;

	display: flex;
	flex-direction: ${(props) => (props.invertButtons ? 'row-reverse' : 'row')};
	justify-content: ${(props) => (props.invertButtons ? 'flex-end' : 'flex-start')};

	button + button {
		margin: 0px;
		${(props) => (props.invertButtons ? 'margin-right: 10px' : 'margin-left: 10px')};
	}
`;

const RegularButton = (props) => <button {...props} />;

export function ConfirmationModal(props) {
	const {
		confirmButtonType,
		confirmOnly,
		confirmProps,
		confirmText,
		ConfirmButtonComponent = RegularButton,
		cancelOnly,
		cancelText,
		CancelButtonComponent = RegularButton,
		footer,
		invertButtons,
		message,
		ModalComponent = WhiteModal,
		onCancelClick,
		onConfirmClick,
		...rest
	} = props;

	return (
		<ModalComponent {...rest} onEnterPress={onConfirmClick}>
			<Fragment>
				<MessageWrapper>{message}</MessageWrapper>
				<ActionButtons className="ConfirmationModal__ActionButtons" invertButtons={invertButtons}>
					{!cancelOnly && (
						<ConfirmButtonComponent
							{...confirmProps}
							className="ConfirmationModal__ActionButtons--confirm"
							onClick={onConfirmClick}
						>
							{confirmText || 'OK'}
						</ConfirmButtonComponent>
					)}
					{!confirmOnly && (
						<CancelButtonComponent
							className="ConfirmationModal__ActionButtons--cancel"
							onClick={onCancelClick}
						>
							{cancelText || 'Cancel'}
						</CancelButtonComponent>
					)}
				</ActionButtons>
				{footer ? <FooterWrapper>{footer}</FooterWrapper> : null}
			</Fragment>
		</ModalComponent>
	);
}

ConfirmationModal.propTypes = {
	...Modal.propTypes,
	CancelButtonComponent: PropTypes.elementType,
	cancelOnly: PropTypes.bool,
	cancelText: PropTypes.string,
	ConfirmButtonComponent: PropTypes.elementType,
	confirmButtonType: PropTypes.string,
	confirmOnly: PropTypes.bool,
	confirmProps: PropTypes.object,
	confirmText: PropTypes.string,
	footer: PropTypes.node,
	invertButtons: PropTypes.bool,
	message: PropTypes.node.isRequired,
	ModalComponent: PropTypes.elementType,
	onCancelClick: PropTypes.func,
	onConfirmClick: PropTypes.func,
};
