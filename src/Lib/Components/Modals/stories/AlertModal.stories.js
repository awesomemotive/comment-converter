// AlertModal.stories.js

import React from 'react';
import { AlertModal } from '../AlertModal';
import { useModal } from '../hooks/useModal';
import { withReactModal } from '../../../.storybook/decorators/withReactModal';

const story = {
	title: 'Lib/Modals/AlertModal',
	component: AlertModal,
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

const Template = (args) => {
	const [AlertModalComp, openModal, closeModal] = useModal(AlertModal);
	return (
		<>
			<button onClick={() => openModal()}>Click here to open the Modal!</button>
			<AlertModalComp {...args} onRequestClose={() => closeModal()} />
		</>
	);
};

export const SuccessAlert = Template.bind({});
SuccessAlert.args = {
	title: 'Success Message Here!',
	type: 'success',
	message: 'This is more context for the user so that they may make an informed next decision.',
	confirmText: 'Save and exit',
	cancelText: 'Exit without saving',
	invertButtons: true,
	onConfirmClick: () => console.log('onConfirmClick'), // eslint-disable-line no-console
	onCancelClick: () => console.log('onCancelClick'), // eslint-disable-line no-console
};

export const WarningAlert = Template.bind({});
WarningAlert.args = {
	title: 'Warning Message Here!',
	type: 'warning',
	message: 'This is more context for the user so that they may make an informed next decision.',
	confirmText: 'Save and exit',
	cancelText: 'Exit without saving',
	invertButtons: true,
	onConfirmClick: () => console.log('onConfirmClick'), // eslint-disable-line no-console
	onCancelClick: () => console.log('onCancelClick'), // eslint-disable-line no-console
};
