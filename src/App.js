import { Fragment } from '@wordpress/element';
import { StyleSheetManager, createGlobalStyle } from 'styled-components';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { PageRouter } from './Pages/PageRouter';
import tw from 'twin.macro';

const GlobalStyle = createGlobalStyle`
	#wpcontent {
		padding: 0 0 40px;
	}

	#footer-left {
		${tw`text-xs text-primaryText`}

		a {
			${tw`text-[#067ce1] no-underline`}

			&.stars {
				${tw`text-primaryYellow`}
			}
		}

		strong {
			${tw`font-bold`}
		}
	}
`;

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <PageRouter />,
		},
	],
	{
		basename: '/wp-admin/admin.php',
	}
);

const App = () => {
	return (
		<Fragment>
			{/* The global style should not be namespaced/scoped. */}
			<GlobalStyle />
			<StyleSheetManager namespace="#comment-converter-app">
				<RouterProvider router={router} />
			</StyleSheetManager>
		</Fragment>
	);
};

export default App;
