import React, { useState } from 'react';
import { FileInputBase } from '../FileInputBase';

// Setup the story definition object.
const story = {
	title: 'Lib/Inputs/FileInputBase',
	component: FileInputBase,
	args: {
		label: 'File Label',
		name: 'file',
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

	return <FileInputBase {...args} onChange={handleChange} value={value} />;
};

export const FileInput = Template.bind({});
