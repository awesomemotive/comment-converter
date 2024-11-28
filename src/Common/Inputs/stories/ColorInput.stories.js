import React, { useState } from 'react';
import { ColorInput as ColorInputComp } from '../ColorInput';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

// Setup the story definition object.
const story = {
	title: 'Common/Inputs/ColorInput',
	component: ColorInputComp,
	decorators: [withCCStyles],
	args: {
		label: 'Label',
		name: 'color',
	},
};
export default story;

const Template = (args) => {
	const [value, setValue] = useState(null);

	const handleChange = (value, name) => {
		setValue(value);
		console.log('onChange', name, value); // eslint-disable-line no-console
	};

	return <ColorInputComp {...args} onChange={handleChange} value={value} />;
};

export const ColorInput = Template.bind({});
