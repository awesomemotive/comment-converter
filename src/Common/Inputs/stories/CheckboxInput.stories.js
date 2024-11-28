import React from 'react';
import { CheckboxInput } from '../CheckboxInput';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

// Setup the story definition object.
const story = {
	title: 'Common/Inputs/CheckboxInput',
	component: CheckboxInput,
	decorators: [withCCStyles],
	args: {
		label: 'Checkbox Label',
		name: 'checkbox',
		onChange: () => {},
	},
};
export default story;

const Template = (args) => <CheckboxInput {...args} />;

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
