import React from 'react';
import styled from 'styled-components';
import { Tooltip as TooltipComp } from '../Tooltip';
import { ArrowTooltip as ArrowTooltipComp } from '../ArrowTooltip';
import { HelpTip as HelpTipComp } from '../HelpTip';

// Setup the story definition object.
const story = {
	title: 'Lib/Tooltips',
};
export default story;

export const Tooltip = (args) => {
	return (
		<TooltipComp content="Helpful text.">
			<span>Text.</span>
		</TooltipComp>
	);
};

export const ArrowTooltip = (args) => {
	return (
		<ArrowTooltipComp content="Helpful text.">
			<span>Text.</span>
		</ArrowTooltipComp>
	);
};

export const HelpTip = (args) => {
	return (
		<HelpTipComp content="Helpful text.">
			<span>Text.</span>
		</HelpTipComp>
	);
};
