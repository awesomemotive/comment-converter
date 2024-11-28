// Modal.stories.js

import React, { useContext, useState } from 'react';
import Modal from '../Modal';
import { IconPlus } from '../../Icons';
import { withReactModal } from '../../../.storybook/decorators/withReactModal';

const story = {
	title: 'Lib/Modals/Modal',
	component: Modal,
	decorators: [withReactModal],
	args: {
		children: <p>Content</p>,
		isOpen: false,
		onEnter: () => console.log('onEnter'), // eslint-disable-line no-console
	},
	argTypes: {
		children: { control: 'text' },
		className: { control: 'text' },
		contentRef: { control: false },
		headerContent: { control: 'object' },
		isOpen: { control: 'boolean', type: { required: true } },
		onEnter: { control: false },
		onRequestClose: { control: false, type: { required: true } },
		overlayRef: { control: false },
		shouldCloseOnOverlayClick: { control: 'boolean' },
		title: { control: 'text' },
		titleIcon: { control: 'object' },
		width: { control: 'number' },
	},
};
export default story;

const Template = (args) => {
	const [isOpen, setOpen] = useState(args.isOpen);
	return (
		<>
			<button onClick={() => setOpen(true)}>Click here to open modal!</button>
			<Modal {...args} isOpen={isOpen} onRequestClose={() => setOpen(false)} />
		</>
	);
};

export const Default = Template.bind({});
Default.args = {
	title: 'Default Modal',
};

export const IconTitle = Template.bind({});
IconTitle.args = {
	title: 'Icon on Title',
	titleIcon: <IconPlus />,
};
