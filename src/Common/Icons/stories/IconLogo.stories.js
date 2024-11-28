import { IconLogo } from '../';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

// Define the component metadata
export default {
	title: 'Common/Icons/IconLogo',
	component: IconLogo,
	decorators: [withCCStyles],
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
	args: {
		type: 'orange',
	},
	argTypes: {
		type: {
			control: {
				type: 'select',
				options: ['orange', 'white'], // Replace with your actual types
			},
		},
		height: { control: 'text' },
		width: { control: 'text' },
	},
};

// Define a template for the component
const Template = (args) => <IconLogo {...args} />;

// Define the actual stories
export const Default = Template.bind({});
