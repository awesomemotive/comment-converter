import { __ } from '@wordpress/i18n';

export const allBulkActionOptions = [
	{
		value: 'confirm',
		label: __('Confirm', 'comment-notifications'),
	},
	{
		value: 'follow-all',
		label: __('Switch to Follow All Comments', 'comment-notifications'),
	},
	{
		value: 'follow-replies',
		label: __('Switch to Follow Only Replies', 'comment-notifications'),
	},
	{
		value: 'delete',
		label: __('Delete', 'comment-notifications'),
	},
	{
		value: 'unsubscribe',
		label: __('Unsubscribe', 'comment-notifications'),
	},
];
export const singleOptInBulkActionOptions = allBulkActionOptions.filter((action) => 'confirm' !== action.value);

export const allFilterOptions = [
	{
		value: '',
		label: __('All', 'comment-notifications'),
	},
	{
		value: 'pending',
		label: __('Pending', 'comment-notifications'),
	},
	{
		value: 'confirmed',
		label: __('Confirmed', 'comment-notifications'),
	},
	// {
	// 	value: 'subscribed',
	// 	label: __('Subscribed', 'comment-notifications'),
	// },
];
export const singleOptInFilterOptions = [];

export const dateFilterOptions = [
	{
		value: '',
		label: __('All Time', 'comment-notifications'),
	},
	{
		value: 'last-7-days',
		label: __('Last 7 Days', 'comment-notifications'),
	},
	{
		value: 'last-30-days',
		label: __('Last 30 Days', 'comment-notifications'),
	},
];

export const followerActions = [
	{
		slug: 'view-follows',
		label: __('View Follows', 'comment-notifications'),
	},
	{
		slug: 'send-email',
		label: __('Send Email', 'comment-notifications'),
	},
	{
		slug: 'edit',
		label: __('Edit', 'comment-notifications'),
	},
	{
		slug: 'follow-all',
		label: __('Follow All Comments', 'comment-notifications'),
	},
	{
		slug: 'follow-replies',
		label: __('Follow Only Replies', 'comment-notifications'),
	},
];
