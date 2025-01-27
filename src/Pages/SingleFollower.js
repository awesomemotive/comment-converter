import { __ } from '@wordpress/i18n';
import { PageBody } from '../Common/Layout/PageBody';
import { SecondaryButton, TextLinkButton } from '../Common/Buttons/BaseButton';
import { useGetFollowerQuery, useGetSettingsQuery, useUpdateFollowerMutation } from '../store/localApi';
import { useQueryParam } from '../Lib/hooks/useQueryParam';
import { IconDuplicate } from '../Common/Icons';
import { FollowsTable } from '../Components/FollowsTable/FollowsTable';
import { FollowerForm } from '../Common/Form/FollowerForm';
import { useNavigate } from 'react-router-dom';
import { columns } from '../Components/FollowsTable/followColumns';
import { WhiteBox } from '../Common/Layout/WhiteBox';
import { Loading } from '../Common/Layout/Loading';
import { Alert } from '../Common/Alert/Alert';
import { parseErrorResponse } from '../utils/error';
import { useCopyTextToClipboard } from '../Lib/hooks/useCopyToClipboard';

export const SingleFollower = () => {
	const [followerId] = useQueryParam('id');

	const { data, error, isLoading } = useGetFollowerQuery(followerId);

	const [updateFollower, updateFollowerResult] = useUpdateFollowerMutation();

	const { data: settings } = useGetSettingsQuery();

	const navigate = useNavigate();

	const { copied, copyText } = useCopyTextToClipboard();

	/**
	 * Handles the saving of the follower data.
	 *
	 * @since 0.9.1
	 *
	 * @param {Object} formState - The follower form state.
	 */
	const handleSaveSettings = (formState) => {
		updateFollower(formState);
	};

	/**
	 * Handles the click event for the back button.
	 * Navigates back in the history stack.
	 *
	 * @since 0.9.1
	 */
	const handleBackClick = () => {
		// TODO: fix case where the WP list table filter alters the history stack and going back -1 is
		// not enough anymore.
		navigate(-1);
	};

	/**
	 * Handles the click event for the copy dashboard link button.
	 */
	const handleCopyDashboardLink = () => {
		copyText(data.follower_dashboard_url);
	};

	if (isLoading || error) {
		return <PageBody>{isLoading ? <Loading /> : <Alert type="error">{parseErrorResponse(error)}</Alert>}</PageBody>;
	}

	return (
		<PageBody>
			<div className="flex flex-row w-full mb-4">
				<div className="flex items-center w-1/2">
					<h1 className="mr-2 rtl:!mr-0 rtl:ml-2 text-lg font-bold text-primaryText">
						{__('Follower Profile', 'subscribe-to-comment-notifications-comment-converter')}
					</h1>
					<SecondaryButton size="small" onClick={handleBackClick}>
						{__('Go Back', 'subscribe-to-comment-notifications-comment-converter')}
					</SecondaryButton>
				</div>
				<div className="flex items-end justify-end w-1/2">
					<TextLinkButton className="text-xs" onClick={handleCopyDashboardLink}>
						{!copied ? (
							<>
								<IconDuplicate className="mr-[5px] rtl:!mr-0 rtl:ml-[5px]" />
								{__('Profile Dashboard Link', 'subscribe-to-comment-notifications-comment-converter')}
							</>
						) : (
							__('Copied!', 'subscribe-to-comment-notifications-comment-converter')
						)}
					</TextLinkButton>
				</div>
			</div>
			<WhiteBox className="mb-8">
				<FollowerForm data={data} onSave={handleSaveSettings} submissionStatus={updateFollowerResult} />
			</WhiteBox>
			<div className="text-sm font-bold text-primaryText">
				{__('Followed Comments', 'subscribe-to-comment-notifications-comment-converter')}
			</div>
			<FollowsTable
				columns={[columns.FOLLOWED_FROM, columns.FOLLOW_TYPE, columns.CREATED, columns.ACTION]}
				disableFilter={true}
				disableSearch={true}
				followerId={followerId}
				isDoubleOptInEnabled={settings?.general?.is_double_optin_enabled}
				verticalRowAlign="middle"
			/>
		</PageBody>
	);
};
