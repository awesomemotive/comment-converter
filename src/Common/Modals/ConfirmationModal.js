import { __ } from '@wordpress/i18n';
import { ConfirmationModal as ConfirmationModalBase } from '../../Lib/Components/Modals/ConfirmationModal';
import { PrimaryButton, SecondaryButton } from '../Buttons/BaseButton';
import { WhiteModal } from './WhiteModal';

export function ConfirmationModal(props) {
	return (
		<ConfirmationModalBase
			confirmText={__('Proceed', 'comment-notifications')}
			{...props}
			ModalComponent={WhiteModal}
			ConfirmButtonComponent={PrimaryButton}
			CancelButtonComponent={(props) => <SecondaryButton {...props} btnClassName="rtl:!mr-[10px]" />}
		/>
	);
}
