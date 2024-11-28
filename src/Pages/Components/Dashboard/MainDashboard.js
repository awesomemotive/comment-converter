import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { Welcome } from './Widgets/Welcome';
import { Total as TotalWidget } from './Widgets/Total';
import { Upsell as UpsellWidget } from './Widgets/Upsell';
import { StarFollowers as StarFollowersWidget } from './Widgets/StarFollowers';
import { MostFollowed as MostFollowedWidget } from './Widgets/MostFollowed';
import { RecentlyFollowedComments as RecentlyFollowedCommentsWidget } from './Widgets/RecentlyFollowedComments';
import { Announcements as AnnouncementsWidget } from './Widgets/Announcements';
import { useDispatch, useSelector } from 'react-redux';
import { dismissWelcomeBack } from '../../../store/slices/sessionDataSlice';

export const MainDashboard = ({ data }) => {
	const {
		widgets: {
			total: { followers: totalFollowers } = {},
			star_followers: starFollowers = [],
			recently_followed_comments: recentlyFollowedComments = [],
			most_followed: mostFollowed = [],
		} = {},
	} = data;

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
			{!dismissedWelcomeBack && (
				<div className="mb-4">
					<Welcome onDismiss={handleWelcomeDismiss} />
				</div>
			)}

			<div className="flex flex-row items-start">
				<div className="w-1/2 ccvtr-left-widgets">
					<div className="mb-4 mr-2 rtl:!mr-0 rtl:ml-2">
						<TotalWidget count={totalFollowers} title={__('Total Followers', 'comment-notifications')} />
					</div>

					{starFollowers && starFollowers.length > 0 && (
						<div className="mb-4 mr-2 rtl:!mr-0 rtl:ml-2">
							<StarFollowersWidget data={starFollowers} />
						</div>
					)}

					{recentlyFollowedComments && recentlyFollowedComments.length > 0 && (
						<div className="mb-4 mr-2 rtl:!mr-0 rtl:ml-2">
							<RecentlyFollowedCommentsWidget data={recentlyFollowedComments} />
						</div>
					)}
				</div>
				<div className="w-1/2 ccvtr-right-widgets">
					<div className="mb-4 ml-2 rtl:!ml-0 rtl:mr-2">
						<UpsellWidget size="small" />
					</div>

					{mostFollowed && mostFollowed.length > 0 && (
						<div className="mb-4 ml-2 rtl:!ml-0 rtl:mr-2">
							<MostFollowedWidget data={mostFollowed} />
						</div>
					)}

					<div className="mb-4 ml-2 rtl:!ml-0 rtl:mr-2">
						<AnnouncementsWidget />
					</div>
				</div>
			</div>
		</div>
	);
};

MainDashboard.propTypes = {
	data: PropTypes.object.isRequired,
};
