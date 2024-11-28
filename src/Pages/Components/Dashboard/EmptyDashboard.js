import { Welcome } from './Widgets/Welcome';
import { Upsell as UpsellWidget } from './Widgets/Upsell';
import { Announcements as AnnouncementsWidget } from './Widgets/Announcements';
import { MissingData as MissingDataWidget } from './Widgets/MissingData';
import { useDispatch, useSelector } from 'react-redux';
import { dismissWelcomeBack } from '../../../store/slices/sessionDataSlice';

export const EmptyDashboard = () => {
	const dismissedWelcomeBack = useSelector((state) => state.sessionData.dismissedWelcomeBack);
	const dispatch = useDispatch();

	/**
	 * Handles the dismissal of the welcome back widget.
	 *
	 * @return {void}
	 */
	const handleWelcomeDismiss = () => {
		dispatch(dismissWelcomeBack());
	};

	return (
		<div className="flex flex-col">
			<div className="mb-4">
				<UpsellWidget size="large" />
			</div>

			{!dismissedWelcomeBack && (
				<div className="mb-4">
					<Welcome onDismiss={handleWelcomeDismiss} />
				</div>
			)}

			<div className="flex flex-row items-start">
				<div className="w-1/2 ccvtr-left-widgets">
					<div className="mb-4 mr-2 rtl:!mr-0 rtl:ml-2">
						<MissingDataWidget />
					</div>
				</div>
				<div className="w-1/2 ccvtr-right-widgets">
					<div className="mb-4 ml-2 rtl:!ml-0 rtl:mr-2">
						<AnnouncementsWidget />
					</div>
				</div>
			</div>
		</div>
	);
};
