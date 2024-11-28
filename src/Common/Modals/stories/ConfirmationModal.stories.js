// ConfirmationModal.stories.js

import React from 'react';
import { ConfirmationModal } from '../ConfirmationModal';
import { useConfirmationModal } from '../hooks/useConfirmationModal';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';
import { withReactModal } from '../../../Lib/.storybook/decorators/withReactModal';
import { BaseButton } from '../../Buttons/BaseButton';

const story = {
	title: 'Common/Modals/ConfirmationModal',
	component: ConfirmationModal,
	decorators: [withCCStyles, withReactModal],
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
	const [ConfirmationModalComp, openModal, closeModal] = useConfirmationModal();
	return (
		<>
			<BaseButton onClick={openModal}>Click here to open the Modal!</BaseButton>
			<br />
			<BaseButton onClick={() => openModal('Different message!')}>
				Click here to open the Modal with a different message!
			</BaseButton>
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
