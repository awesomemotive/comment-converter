import { useGetDashboardQuery } from '../store/localApi';
import { useGetAnnouncementsQuery } from '../store/marketingApi';
import { MainDashboard } from './Components/Dashboard/MainDashboard';
import { EmptyDashboard } from './Components/Dashboard/EmptyDashboard';
import { PageBody } from '../Common/Layout/PageBody';
import { Loading } from '../Common/Layout/Loading';
import { Alert } from '../Common/Alert/Alert';
import { parseErrorResponse } from '../utils/error';

export const Dashboard = () => {
	const { data: dashboardData, error: dashboardError, isLoading: dashboardLoading } = useGetDashboardQuery();

	const { error: announcementsError, isLoading: announcementsLoading } = useGetAnnouncementsQuery();

	// Combined loading state
	const isLoading = dashboardLoading || announcementsLoading;

	// Combined error state
	const error = dashboardError || announcementsError;

	const totalFollowers = dashboardData?.widgets?.total?.followers || 0;

	if (isLoading || error) {
		return (
			<PageBody>
				<div className="m-auto w-[1160px]">
					{isLoading ? <Loading /> : <Alert type="error">{parseErrorResponse(error)}</Alert>}
				</div>
			</PageBody>
		);
	}

	return (
		<PageBody>
			<div className="m-auto w-[1160px]">
				{totalFollowers > 0 ? <MainDashboard data={dashboardData} /> : <EmptyDashboard />}
			</div>
		</PageBody>
	);
};
