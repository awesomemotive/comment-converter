import React from 'react';
import { RadioButtonInput } from '../RadioButtonInput';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

// Setup the story definition object.
const story = {
	title: 'Common/Inputs/RadioButtonInput',
	component: RadioButtonInput,
	decorators: [withCCStyles],
	args: {
		label: 'RadioButton Label',
		name: 'readio',
		onChange: () => {},
	},
};
export default story;

const Template = (args) => <RadioButtonInput {...args} />;

export const RadioButton = Template.bind({});

export const CheckedRadioButton = Template.bind({});
CheckedRadioButton.args = {
	checked: true,
	label: 'Checked RadioButton Label',
};

export const DisabledRadioButton = Template.bind({});
DisabledRadioButton.args = {
	disabled: true,
	label: 'Disabled RadioButton Label',
};
