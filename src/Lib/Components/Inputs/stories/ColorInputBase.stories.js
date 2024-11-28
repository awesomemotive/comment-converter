import React, { useState } from 'react';
import ColorInputBase from '../ColorInputBase';

// Setup the story definition object.
const story = {
	title: 'Lib/Inputs/ColorInputBase',
	component: ColorInputBase,
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

	return <ColorInputBase {...args} onChange={handleChange} value={value} />;
};

export const ColorInput = Template.bind({});
