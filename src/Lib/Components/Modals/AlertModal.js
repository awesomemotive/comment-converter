import React from 'react';
import PropTypes from 'prop-types';
import { IconCheckCircleDuotone, IconWarningTriangle } from '../Icons';
import { ConfirmationModal } from './ConfirmationModal';

export function AlertModal(props) {
	const { type, ModalComponent = ConfirmationModal, ...rest } = props;

	switch (type) {
		case 'success':
			rest.titleIcon = <IconCheckCircleDuotone fill="#46b450" />;
			break;
		case 'warning':
			rest.titleIcon = <IconWarningTriangle fill="#f56e28" />;
			break;
		default:
			break;
	}

	return <ModalComponent {...rest} />;
}

AlertModal.propTypes = {
	...ConfirmationModal.propTypes,
	ModalComponent: PropTypes.elementType,
	type: PropTypes.oneOf(['success', 'warning']).isRequired,
};
