import { __ } from '@wordpress/i18n';
import { Dashboard } from './Dashboard';
import { OutputMessage } from './OutputMessage';
import { PageBody } from '../Common/Layout/PageBody';

export const DashboardWrapper = () => {
	const { followerId, error } = window.ccData;

	if (error) {
		return (
			<PageBody>
				<OutputMessage />
			</PageBody>
		);
	}

	if (!followerId) {
		return (
			<PageBody>
				<OutputMessage error={__('Follower not found.', 'comment-notifications')} />
			</PageBody>
		);
	}

	return <Dashboard followerId={followerId} />;
};
