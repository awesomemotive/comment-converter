import React, { useState } from 'react';
import { RadioButtonGroup as RadioButtonGroupComp } from '../RadioButtonGroup';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

// Setup the story definition object.
const story = {
	title: 'Common/Inputs/RadioButtonGroup',
	component: RadioButtonGroupComp,
	decorators: [withCCStyles],
	args: {
		label: 'Label',
		name: 'radioGroup',
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

	return <RadioButtonGroupComp {...args} onChange={handleChange} value={value} />;
};

export const RadioButtonGroup = Template.bind({});
