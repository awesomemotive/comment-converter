import { WhiteBox } from '../WhiteBox';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

export default {
	title: 'Layout/WhiteBox',
	component: WhiteBox,
	decorators: [withCCStyles],
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
	args: {
		className: 'm-8',
		children: (
			<div>
				<p>Body</p>
			</div>
		),
	},
};

export const Default = {
	args: {},
};

export const WithHeader = {
	args: {
		className: 'm-8',
		header: (
			<div>
				<h1 className="text-xl text-primaryText font-bold">Header</h1>
			</div>
		),
	},
};
