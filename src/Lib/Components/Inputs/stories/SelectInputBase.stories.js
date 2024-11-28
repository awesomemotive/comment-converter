import React from 'react';
import { SelectInputBase } from '../SelectInputBase';

// Setup the story definition object.
const story = {
	title: 'Lib/Inputs/SelectInputBase',
	component: SelectInputBase,
	args: {
		label: 'Select Label',
		labelPosition: 'top',
		name: 'select',
		onChange: () => {},
		options: [
			{ label: 'OptinMonster', value: 'optinmonster' },
			{ label: 'WPForms', value: 'wpforms' },
			{ label: 'MonsterInsights', value: 'monsterinsights' },
			{ label: 'RafflePress', value: 'rafflepress' },
		],
	},
	argTypes: {
		components: { control: false },
		inputValue: { control: false },
		label: { control: 'text', type: { required: true } },
		labelPosition: { control: { type: 'inline-radio' }, options: ['top', 'left'] },
		name: { control: 'text', type: { required: true } },
		onChange: { control: false, type: { required: true } },
		onInputChange: { control: false },
		onKeyDown: { control: false },
		options: { control: 'object' },
		styles: { control: false },
		value: { control: 'array' },
	},
};
export default story;

const Template = (args) => <SelectInputBase {...args} />;

export const Select = Template.bind({});

export const Creatable = Template.bind({});
Creatable.args = {
	creatable: true,
	label: 'Creatable Label',
	name: 'creatable',
};

export const MultiSelect = Template.bind({});
MultiSelect.args = {
	isMulti: true,
	label: 'Multi Select Label',
	name: 'multi-select',
};

export const MultiSelectCreatable = Template.bind({});
MultiSelectCreatable.args = {
	isMulti: true,
	label: 'Creatable Multi Select Label',
	name: 'creatable-multi-select',
};
