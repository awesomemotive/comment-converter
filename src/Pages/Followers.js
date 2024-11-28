import { PageBody } from '../Common/Layout/PageBody';
import { useGetSettingsQuery } from '../store/localApi';
import { FollowsTable } from '../Components/FollowsTable/FollowsTable';
import { columns } from '../Components/FollowsTable/followColumns';

export const Followers = () => {
	const { data: settings } = useGetSettingsQuery();

	return (
		<PageBody>
			<FollowsTable
				columns={[columns.FOLLOWER, columns.FOLLOWED_FROM, columns.COMMENT, columns.CREATED, columns.ACTION]}
				isDoubleOptInEnabled={settings?.general?.is_double_optin_enabled}
			/>
		</PageBody>
	);
};
