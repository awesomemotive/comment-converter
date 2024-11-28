import React, { useState } from 'react';
import { YesNoSwitchBase } from '../YesNoSwitchBase';

// Setup the story definition object.
export default {
	title: 'Lib/Inputs/YesNoSwitchBase',
	component: YesNoSwitchBase,
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
	args: {
		label: 'Yes No Label',
		labelPosition: 'top',
		name: 'YesNoSwitchBase',
	},
	argTypes: {
		checked: { control: 'boolean' },
		className: { control: 'text' },
		disabled: { control: 'boolean' },
		label: { control: 'text', type: { required: true } },
		labelHidden: { control: 'boolean' },
		labelPosition: { control: { type: 'inline-radio' }, options: ['top', 'left'] },
		name: { control: 'text', type: { required: true } },
		onChange: { control: false, type: { required: true } },
		value: { control: false },
	},
};

const Template = (args) => {
	const [checked, setChecked] = useState(args.checked);
	return <YesNoSwitchBase {...args} checked={checked} onChange={() => setChecked(!checked)} />;
};

export const Default = Template.bind({});
