import { createSearchParams, useNavigate } from 'react-router-dom';
import { routedPages } from '../routes';

export const useNavigation = () => {
	const navigate = useNavigate();

	/**
	 * Navigates to the specified page with the provided query parameters.
	 *
	 * @param {string} pageSlug    - The slug of the page to navigate to.
	 * @param {Object} queryParams - The query parameters to include in the navigation.
	 */
	const goToPage = (pageSlug, queryParams) => {
		if (!routedPages[pageSlug]) {
			console.error(`Page slug '${pageSlug}' not found.`);
			return;
		}

		const page = routedPages[pageSlug];
		navigate(`${page.path}&${createSearchParams(queryParams).toString()}`);
	};

	return {
		goToPage,
	};
};
