import { AlertModal as AlertModalBase } from '../../Lib/Components/Modals/AlertModal';
import { ConfirmationModal } from './ConfirmationModal';

export function AlertModal(props) {
	return <AlertModalBase {...props} ModalComponent={ConfirmationModal} />;
}
