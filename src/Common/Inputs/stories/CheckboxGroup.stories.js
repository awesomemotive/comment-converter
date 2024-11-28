import React, { useState } from 'react';
import { CheckboxGroup as CheckboxGroupComp } from '../CheckboxGroup';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

// Setup the story definition object.
const story = {
	title: 'Common/Inputs/CheckboxGroup',
	component: CheckboxGroupComp,
	decorators: [withCCStyles],
	args: {
		label: 'Label',
		name: 'checkboxGroup',
		options: [
			{
				label: 'Option 1',
				value: 'option1',
			},
			{
				label: 'Option 2',
				value: 'option2',
			},
			{
				label: 'Option 3',
				value: 'option3',
			},
		],
	},
};
export default story;

const Template = (args) => {
	const [value, setValue] = useState([]);

	const handleChange = (value, name) => {
		setValue(value);
		console.log('onChange', name, value); // eslint-disable-line no-console
	};

	return <CheckboxGroupComp {...args} onChange={handleChange} value={value} />;
};

export const CheckboxGroup = Template.bind({});
