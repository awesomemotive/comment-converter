import { useCallback, useRef, useEffect } from '@wordpress/element';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageWrapper } from '../Common/Layout/PageWrapper';
import { Menu } from '../Common/Layout/Menu';
import { HeaderBanner } from '../Common/Layout/HeaderBanner';
import { pageTree, routedPageComponents, routedPages } from './routes';
import { QuickLinks } from '../Components/QuickLinks/QuickLinks';
import { usePrevious } from '../Lib/hooks/usePrevious';

// Build a list of menu items
const menuItems = pageTree.filter((item) => !item.hideInMenu);

// Build a list of redirect pages
const redirectRoutes = pageTree.filter((item) => item.redirect);

export const PageRouter = () => {
	const [searchParams] = useSearchParams();
	const currPage = searchParams.get('page');
	const pageSlug = currPage.replace('comment-converter-', '');
	const prevPageSlug = usePrevious(pageSlug);
	const RoutedPage = routedPageComponents[pageSlug] || (() => null);
	const navigate = useNavigate();
	const topLevelMenu = useRef(null);

	useEffect(() => {
		// Stores the top level menu item for later use.
		topLevelMenu.current = document.getElementById('toplevel_page_comment-converter-dashboard');
	}, []);

	useEffect(() => {
		// If there's no previous page slug, we're on the initial page load. And we should keep the WP page title.
		if (!prevPageSlug) {
			return;
		}

		// Only updates title when page changes.
		if (prevPageSlug !== pageSlug) {
			// Replaces the page title with the new page title.
			document.title = document.title.replace(routedPages[prevPageSlug].label, routedPages[pageSlug].label);
		}
	}, [pageSlug, prevPageSlug]);

	/**
	 * Updates the currently active menu item.
	 *
	 * @param {HTMLElement} newMenuListItem The new menu item to make active.
	 */
	const updateCurrentMenuItem = useCallback((newMenuListItem) => {
		if (!topLevelMenu.current) {
			return;
		}

		const subMenuParent = topLevelMenu.current.querySelector('.wp-submenu');
		const currMenuListItem = subMenuParent.querySelector('li.current');

		if (currMenuListItem === newMenuListItem) {
			return;
		}

		// The currently active menu item needs to be updated. Both the `li` and `a` elements
		// need to have the `current` class removed and the `aria-current` attribute removed,
		// and added to the new menu item.

		const currMenuLink = subMenuParent.querySelector('a.current');
		currMenuListItem.classList.remove('current');
		currMenuLink.classList.remove('current');
		currMenuLink.removeAttribute('aria-current');

		newMenuListItem.classList.add('current');
		const menuLink = newMenuListItem.querySelector('a');
		menuLink.classList.add('current');
		menuLink.setAttribute('aria-current', 'page');
	}, []);

	// Link the WordPress menu with the React Router so clicks on the menu can trigger a React page change.
	useEffect(() => {
		if (!topLevelMenu.current) {
			return;
		}

		// Add a class to each menu item so we can easily find them later using the page slug
		topLevelMenu.current.querySelectorAll('a').forEach((item) => {
			const href = item.getAttribute('href');

			if (href?.includes('admin.php?page=comment-converter')) {
				const linkPageSlug = href.replace('admin.php?page=', '');
				const menuListItem = item.closest('li');
				menuListItem.classList.add(linkPageSlug);
			}
		});

		const handleLinkClick = (event) => {
			const href = event.target.getAttribute('href');

			// Confirm the clicked element is a link to a page in our app
			if (href?.includes('admin.php?page=comment-converter')) {
				// If it's a redirect route we let the defautl behavior happen
				const isRedirectRoute = redirectRoutes.find((item) => `admin.php${item.path}` === href);
				if (isRedirectRoute) {
					return;
				}

				const menuListItem = event.target.closest('li');

				// Update the current menu item
				updateCurrentMenuItem(menuListItem);

				// Prevent the default link behavior
				event.preventDefault();

				// Use React Router to navigate
				navigate(href.replace('admin.php', ''));
			}
		};

		// Attach the click event listener to the top level menu item
		topLevelMenu.current.addEventListener('click', handleLinkClick);

		// Clean up the event listener when the component unmounts
		return () => {
			topLevelMenu.current.removeEventListener('click', handleLinkClick);
		};
	}, [navigate, updateCurrentMenuItem]);

	// Update the WordPress selected menu state when the React Router page changes.
	useEffect(() => {
		if (!topLevelMenu.current) {
			return;
		}

		const currPageMenuItem = topLevelMenu.current.querySelector(`li.${currPage}`);

		if (!currPageMenuItem) {
			return;
		}

		// Update the current menu item when the page changes.
		updateCurrentMenuItem(currPageMenuItem);
	}, [currPage, updateCurrentMenuItem]);

	return (
		<PageWrapper>
			<HeaderBanner />
			<Menu activeItem={pageSlug} items={menuItems} />
			<RoutedPage />
			<QuickLinks />
		</PageWrapper>
	);
};
