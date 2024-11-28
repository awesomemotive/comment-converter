import { useModal } from '../../../Lib/Components/Modals/hooks/useModal';
import { ConfirmationModal } from '../ConfirmationModal';

/**
 * Hook to help to manage the confirmation modal state.
 *
 * @return {Array} An array containing the actual modal, a open modal method, and a close modal method.
 */
export function useConfirmationModal() {
	return useModal(ConfirmationModal);
}
