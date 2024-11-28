import React, { useState } from 'react';
import { FileInput as FileInputComp } from '../FileInput';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

// Setup the story definition object.
const story = {
	title: 'Common/Inputs/FileInput',
	component: FileInputComp,
	decorators: [withCCStyles],
	args: {
		label: 'Label',
		name: 'file',
		placeholder: '(recommended size: 64px x 64px)',
	},
};
export default story;

const Template = (args) => {
	const [value, setValue] = useState(null);

	const handleChange = (value, name) => {
		setValue(value);
		console.log('onChange', name, value); // eslint-disable-line no-console
	};

	return <FileInputComp {...args} onChange={handleChange} value={value} />;
};

export const FileInput = Template.bind({});
