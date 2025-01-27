import { __ } from '@wordpress/i18n';

export const allBulkActionOptions = [
	{
		value: 'confirm',
		label: __('Confirm', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		value: 'follow-all',
		label: __('Switch to Follow All Comments', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		value: 'follow-replies',
		label: __('Switch to Follow Only Replies', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		value: 'delete',
		label: __('Delete', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		value: 'unsubscribe',
		label: __('Unsubscribe', 'subscribe-to-comment-notifications-comment-converter'),
	},
];
export const singleOptInBulkActionOptions = allBulkActionOptions.filter((action) => 'confirm' !== action.value);

export const allFilterOptions = [
	{
		value: '',
		label: __('All', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		value: 'pending',
		label: __('Pending', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		value: 'confirmed',
		label: __('Confirmed', 'subscribe-to-comment-notifications-comment-converter'),
	},
	// {
	// 	value: 'subscribed',
	// 	label: __('Subscribed', 'subscribe-to-comment-notifications-comment-converter'),
	// },
];
export const singleOptInFilterOptions = [];

export const dateFilterOptions = [
	{
		value: '',
		label: __('All Time', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		value: 'last-7-days',
		label: __('Last 7 Days', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		value: 'last-30-days',
		label: __('Last 30 Days', 'subscribe-to-comment-notifications-comment-converter'),
	},
];

export const followerActions = [
	{
		slug: 'view-follows',
		label: __('View Follows', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		slug: 'send-email',
		label: __('Send Email', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		slug: 'edit',
		label: __('Edit', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		slug: 'follow-all',
		label: __('Follow All Comments', 'subscribe-to-comment-notifications-comment-converter'),
	},
	{
		slug: 'follow-replies',
		label: __('Follow Only Replies', 'subscribe-to-comment-notifications-comment-converter'),
	},
];
