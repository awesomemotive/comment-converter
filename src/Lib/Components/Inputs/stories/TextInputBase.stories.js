import React, { useState } from 'react';
import { TextInputBase } from '../TextInputBase';

// Setup the story definition object.
export default {
	title: 'Lib/Inputs/TextInputBase',
	component: TextInputBase,
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
	args: {
		debounceWait: 300,
		label: 'Text Label',
		labelPosition: 'top',
		name: 'textInput',
		placeholder: 'Enter text here',
	},
	argTypes: {
		className: { control: 'text' },
		debounceWait: { control: 'number' },
		disabled: { control: 'boolean' },
		inputRef: { control: false },
		label: { control: 'text', type: { required: true } },
		labelHidden: { control: 'boolean' },
		labelPosition: { control: { type: 'inline-radio' }, options: ['top', 'right', 'left'] },
		name: { control: 'text', type: { required: true } },
		onBlur: { control: false },
		onChange: { control: false, type: { required: true } },
		onFocus: { control: false },
		onKeyUp: { control: false },
		placeholder: { control: 'text' },
		value: { control: 'text' },
	},
};

const Template = (args) => {
	const [value, setValue] = useState(args.value);
	return <TextInputBase {...args} value={value} onChange={(value) => setValue(value)} />;
};

export const Default = Template.bind({});
