import { Fragment } from '@wordpress/element';
import { StyleSheetManager } from 'styled-components';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { DashboardWrapper } from './DashboardWrapper';

// The base path is dynamic and is set from the Dashboard URL setting or the current URL if the Follower Dashboard is being rendered from a shortcode.
const basePath = window.ccData.followerDashboardBasePath.replace(/^\/|\/$/g, '');

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <DashboardWrapper />,
		},
		{
			path: '/confirm',
			element: <DashboardWrapper />,
		},
		{
			path: '/unsubscribe',
			element: <DashboardWrapper />,
		},
	],
	{
		basename: '/' + basePath,
	}
);

const App = () => {
	return (
		<Fragment>
			<StyleSheetManager namespace="#comment-converter-app">
				<RouterProvider router={router} />
			</StyleSheetManager>
		</Fragment>
	);
};

export default App;
