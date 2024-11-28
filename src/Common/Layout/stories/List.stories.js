import { List } from '../List';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

export default {
	title: 'Layout/List',
	component: List,
	decorators: [withCCStyles],
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
	args: {
		items: ['Item 1', 'Item 2', 'Item 3'],
	},
};

export const Default = {
	args: {},
};

export const WithHtmlElements = {
	args: {
		items: [<div>Item 1</div>, <div>Item 2</div>, <div>Item 3</div>],
	},
};
