import React from 'react';
import styled from 'styled-components';
import * as Icons from '../';

// Setup the story definition object.
const story = {
	title: 'Lib/Icons',
	args: {
		fill: '#000',
		height: '100%',
		iconFill: '#fff',
		width: '100%',
	},
	argTypes: {
		fill: { control: 'color' },
		height: { control: 'text' },
		iconFill: { control: 'color' },
		width: { control: 'text' },
	},
};
export default story;

const List = styled.ul`
	display: flex;
	flex-wrap: wrap;
	list-style: none;
	margin: 0;
	padding: 0;

	& * {
		box-sizing: border-box;
	}
`;

const ListItem = styled.li`
	align-items: center;
	border: 1px solid #000;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
	font-size: 12px;
	height: 200px;
	justify-content: center;
	margin: 5px;
	text-align: center;
	width: 150px;
	word-break: break-all;
`;

const IconWrapper = styled.div`
	align-items: center;
	display: flex;
	flex: 1 0 auto;
	justify-content: center;
	max-height: 150px;
	padding: 5px;
`;

const IconName = styled.div`
	align-items: center;
	display: flex;
	height: 50px;
	justify-content: center;
	padding-left: 5px;
	padding-right: 5px;
`;

const Template = (args) => {
	return (
		<List>
			{Object.keys(Icons).map((iconKey, i) => {
				const Component = Icons[iconKey];
				return (
					<ListItem key={i} title={iconKey}>
						<IconWrapper>
							<Component {...args} />
						</IconWrapper>
						<IconName>
							<span>{iconKey}</span>
						</IconName>
					</ListItem>
				);
			})}
		</List>
	);
};

export const AllIcons = Template.bind({});
