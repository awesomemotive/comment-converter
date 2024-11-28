import React, { useState } from 'react';
import { TextListInputBase } from '../TextListInputBase';

// Setup the story definition object.
const story = {
	title: 'Lib/Inputs/TextListInputBase',
	component: TextListInputBase,
	args: {
		label: 'Text List Label',
		name: 'list',
		onChange: () => {},
	},
};
export default story;

const Template = (args) => {
	const [value, setValue] = useState(null);

	const handleChange = (value, name) => {
		setValue(value);
		console.log('onChange', name, value); // eslint-disable-line no-console
	};

	return <TextListInputBase {...args} onChange={handleChange} value={value} />;
};

export const TextListInput = Template.bind({});
