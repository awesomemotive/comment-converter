import React, { useState } from 'react';
import { CheckboxGroupBase } from '../CheckboxGroupBase';

// Setup the story definition object.
const story = {
	title: 'Lib/Inputs/CheckboxGroupBase',
	component: CheckboxGroupBase,
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

	return <CheckboxGroupBase {...args} onChange={handleChange} value={value} />;
};

export const CheckboxGroup = Template.bind({});
