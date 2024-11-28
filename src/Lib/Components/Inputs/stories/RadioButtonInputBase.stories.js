import React from 'react';
import { RadioButtonInputBase } from '../RadioButtonInputBase';

// Setup the story definition object.
const story = {
	title: 'Lib/Inputs/RadioButtonInputBase',
	component: RadioButtonInputBase,
	args: {
		label: 'Radio Button Label',
		name: 'radio',
		onChange: () => {},
	},
};
export default story;

const Template = (args) => <RadioButtonInputBase {...args} />;

export const RadioButton = Template.bind({});

export const CheckedRadioButton = Template.bind({});
CheckedRadioButton.args = {
	checked: true,
	label: 'Checked Radio Button Label',
};

export const DisabledRadioButton = Template.bind({});
DisabledRadioButton.args = {
	disabled: true,
	label: 'Disabled Radio Button Label',
};
