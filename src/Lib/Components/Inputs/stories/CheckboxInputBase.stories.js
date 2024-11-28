import React from 'react';
import { CheckboxInputBase } from '../CheckboxInputBase';

// Setup the story definition object.
const story = {
	title: 'Lib/Inputs/CheckboxInputBase',
	component: CheckboxInputBase,
	args: {
		label: 'Checkbox Label',
		name: 'checkbox',
		onChange: () => {},
	},
};
export default story;

const Template = (args) => <CheckboxInputBase {...args} />;

export const Checkbox = Template.bind({});

export const CheckedCheckbox = Template.bind({});
CheckedCheckbox.args = {
	checked: true,
	label: 'Checked Checkbox Label',
};

export const DisabledCheckbox = Template.bind({});
DisabledCheckbox.args = {
	disabled: true,
	label: 'Disabled Checkbox Label',
};
