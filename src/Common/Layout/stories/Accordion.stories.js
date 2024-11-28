import { Accordion } from '../Accordion';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

export default {
	title: 'Layout/Accordion',
	component: Accordion,
	decorators: [withCCStyles],
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
	args: {
		className: '',
		title: 'Accordion Title',
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
