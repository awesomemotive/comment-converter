// ColorPicker.stories.js

import React, { useState } from 'react';
import ColorPickerBase from '../ColorPickerBase';
import { ChromePicker } from 'react-color';

const story = {
	title: 'Lib/Inputs/ColorPickerBase',
	component: ColorPickerBase,
	decorators: [
		(Story) => (
			<div
				style={{
					boxShadow: '0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3)',
					display: 'inline-block',
				}}
			>
				<Story />
			</div>
		),
	],
	args: {
		label: 'Label',
		name: 'color',
		onChange: () => {},
	},
};
export default story;

/**
 * Returns a string of the parsed color picker object value.
 *
 * @param {Object} color The color picker color object.
 *
 * @return {string} The parsed color value in hex or rgba.
 */
const getColorFromPicker = (color) => {
	if (typeof color === 'string') {
		return color;
	}

	const useHex = color.rgb.a === 1;
	let returnedColor = color;
	if (useHex) {
		returnedColor = color.hex;
	} else {
		returnedColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
	}

	return returnedColor;
};

const Template = (args) => {
	const [color, setColor] = useState(args.color);
	return (
		<ColorPickerBase
			{...args}
			color={color}
			onChangeColor={setColor}
			onChangeComplete={(value) => {
				setColor(getColorFromPicker(value));
			}}
		/>
	);
};

export const Custom = Template.bind({});
Custom.args = {
	color: '#128379',
	defaultView: 'hex',
};

export const PresetColors = Template.bind({});
PresetColors.args = {
	color: '#128379',
	defaultView: 'hex',
	presetColors: ['#128379', '#729462', '#840392', '#802934', '#ab7d82', '#92b7af'],
};

const ChromeTemplate = (args) => {
	const [color, setColor] = useState(args.color);
	return (
		<ChromePicker
			{...args}
			color={color}
			onChangeColor={setColor}
			onChangeComplete={(value) => {
				setColor(getColorFromPicker(value));
			}}
		/>
	);
};

export const Chrome = ChromeTemplate.bind({});
Chrome.args = {
	color: '#128379',
	defaultView: 'hex',
};
