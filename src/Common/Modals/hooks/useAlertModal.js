import { useModal } from '../../../Lib/Components/Modals/hooks/useModal';
import { AlertModal } from '../AlertModal';

/**
 * Hook to help to manage the alert modal state.
 *
 * @return {Array} An array containing the actual modal, a open modal method, and a close modal method.
 */
export function useAlertModal() {
	return useModal(AlertModal);
}
