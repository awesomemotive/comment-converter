
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';
import { Alert } from '../Alert';

export default {
	title: 'Common/Alert',
	component: Alert,
	decorators: [withCCStyles],
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
	args: {},
};

const Template = (args) => <Alert {...args} />;

export const InfoAlert = Template.bind({});
InfoAlert.args = {
	type: 'info',
	children: 'Info Alert Message',
};

export const ErrorAlert = Template.bind({});
ErrorAlert.args = {
	type: 'error',
	children: 'Error Alert Message',
};
