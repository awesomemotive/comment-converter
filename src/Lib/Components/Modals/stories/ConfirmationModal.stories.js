// ConfirmationModal.stories.js

import React from 'react';
import { ConfirmationModal } from '../ConfirmationModal';
import { useModal } from '../hooks/useModal';
import { withReactModal } from '../../../.storybook/decorators/withReactModal';

const story = {
	title: 'Lib/Modals/ConfirmationModal',
	component: ConfirmationModal,
	decorators: [withReactModal],
	/* args: {
		isOpen: false,
		children: <p>Content</p>,
	},
	argTypes: {
		children: { control: 'object' },
		className: { control: 'text' },
		contentRef: { control: false },
		headerContent: { control: 'object' },
		isOpen: { control: 'boolean', type: { required: true } },
		onRequestClose: { control: false, type: { required: true } },
		overlayRef: { control: false },
		shouldCloseOnOverlayClick: { control: 'boolean' },
		title: { control: 'text' },
	}, */
};
export default story;

const ConfirmationTemplate = (args) => {
	const [ConfirmationModalComp, openModal, closeModal] = useModal(ConfirmationModal);
	return (
		<>
			<button onClick={openModal}>Click here to open the Modal!</button>
			<button onClick={() => openModal('Different message!')}>
				Click here to open the Modal with a different message!
			</button>
			<ConfirmationModalComp {...args} onRequestClose={() => closeModal()} />
		</>
	);
};

export const Default = ConfirmationTemplate.bind({});
Default.args = {
	message: 'Are you sure you are OK?',
	onConfirmClick: () => console.log('onConfirmClick'), // eslint-disable-line no-console
	onCancelClick: () => console.log('onCancelClick'), // eslint-disable-line no-console
};

export const WithTitle = ConfirmationTemplate.bind({});
WithTitle.args = {
	title: 'Confirmation Modal',
	message: 'Are you sure you are OK?',
	onConfirmClick: () => console.log('onConfirmClick'), // eslint-disable-line no-console
	onCancelClick: () => console.log('onCancelClick'), // eslint-disable-line no-console
};
