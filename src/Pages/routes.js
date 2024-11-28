import { __ } from '@wordpress/i18n';
import { GettingStarted } from './GettingStarted';
import { Dashboard } from './Dashboard';
import { Followers } from './Followers';
import { CommentForm } from './CommentForm';
import { Emails } from './Emails';
//import { Integrations } from './Integrations';
import { Options } from './Options';
import { AboutUs } from './AboutUs';
import { SingleFollower } from './SingleFollower';

export const pageTree = [
	{
		// translators: Comment Converter is the name of the plugin.
		label: __('Welcome to Comment Converter', 'comment-notifications'),
		slug: 'getting-started',
		path: '?page=comment-converter-getting-started',
		hideInMenu: true,
		component: GettingStarted,
	},
	{
		label: __('Dashboard', 'comment-notifications'),
		slug: 'dashboard',
		path: '?page=comment-converter-dashboard',
		hideInMenu: true,
		component: Dashboard,
	},
	{
		label: __('Followers', 'comment-notifications'),
		slug: 'followers',
		path: '?page=comment-converter-followers',
		items: [
			{
				label: __('Followers', 'comment-notifications'),
				slug: 'followers',
				path: '?page=comment-converter-followers',
				component: Followers,
			},
			{
				label: __('Single Follower', 'comment-notifications'),
				slug: 'follower',
				path: '?page=comment-converter-follower',
				hideInMenu: true,
				component: SingleFollower,
			},
		],
	},
	{
		label: __('Notifications', 'comment-notifications'),
		slug: 'comment-form',
		path: '?page=comment-converter-comment-form',
		items: [
			{
				label: __('Comment Form', 'comment-notifications'),
				slug: 'comment-form',
				path: '?page=comment-converter-comment-form',
				component: CommentForm,
			},
			{
				label: __('Emails', 'comment-notifications'),
				slug: 'emails',
				path: '?page=comment-converter-emails',
				component: Emails,
			},
		],
	},
	/* {
		label: __('Integrations', 'comment-notifications'),
		slug: 'integrations',
		path: '?page=comment-converter-integrations',
		component: Integrations,
	}, */
	{
		label: __('Options', 'comment-notifications'),
		slug: 'options',
		path: '?page=comment-converter-options',
		component: Options,
	},
	{
		label: __('About Us', 'comment-notifications'),
		slug: 'about-us',
		path: '?page=comment-converter-about-us',
		component: AboutUs,
	},
	{
		label: __('Upgrade to Pro', 'comment-notifications'),
		slug: 'upgrade',
		path: '?page=comment-converter-upgrade',
		redirect: true,
	},
];

// Build a map of page slugs to page config.
export const routedPages = pageTree.reduce((acc, item) => {
	if (item.component) {
		acc[item.slug] = item;
	}

	if (item.items) {
		item.items.forEach((subItem) => {
			if (subItem.component) {
				acc[subItem.slug] = subItem;
			}
		});
	}

	return acc;
}, {});

// Build a map of page slugs to page components.
export const routedPageComponents = Object.values(routedPages).reduce((acc, item) => {
	if (item.component) {
		acc[item.slug] = item.component;
	}

	return acc;
}, {});
