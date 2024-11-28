import { Menu } from '../Menu';
import { withRouter } from 'storybook-addon-react-router-v6';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

export default {
	title: 'Layout/Menu',
	component: Menu,
	decorators: [withRouter, withCCStyles],
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
	args: {
		items: [
			{
				label: 'Followers',
				slug: 'followers',
				path: 'admin.php?page=comment-converter-followers',
			},
			{
				label: 'Notifications',
				slug: 'notifications',
				path: 'admin.php?page=comment-converter-notifications',
				items: [
					{
						label: 'Comment Form',
						slug: 'comment-form',
						path: 'admin.php?page=comment-converter-comment-form',
					},
					{
						label: 'Emails',
						slug: 'emails',
						path: 'admin.php?page=comment-converter-emails',
					},
				],
			},
			{
				label: 'Integrations',
				slug: 'integrations',
				path: 'admin.php?page=comment-converter-integrations',
			},
		],
	},
};

export const ParentMenuActive = {
	args: {
		activeItem: 'followers',
	},
};

export const SubMenuActive = {
	args: {
		activeItem: 'comment-form',
	},
};
