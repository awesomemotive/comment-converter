import React, { useState } from 'react';
import { TextListInput as TextListInputComp } from '../TextListInput';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

// Setup the story definition object.
const story = {
	title: 'Common/Inputs/TextListInput',
	component: TextListInputComp,
	decorators: [withCCStyles],
	args: {
		label: 'Label',
		name: 'file',
	},
};
export default story;

const Template = (args) => {
	const [value, setValue] = useState(null);

	const handleChange = (value, name) => {
		setValue(value);
		console.log('onChange', name, value); // eslint-disable-line no-console
	};

	return <TextListInputComp {...args} onChange={handleChange} value={value} />;
};

export const TextListInput = Template.bind({});
