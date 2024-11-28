import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { TextInput } from '../Inputs/TextInput';
import { Form } from './Form';
import { EmailPreviewInline } from './EmailPreviewInline';
import { isValidEmail } from '../../Lib/util/email';

export const EmailsForm = (props) => {
	/**
	 * Renders the body of the email field.
	 *
	 * @param {Object} inputProps The properties for the TextInput component.
	 * @param {Object} _formState The current state of the form. This parameter is not used in the function.
	 * @param {Object} actions    The actions that can be performed in the form, such as setting the error.
	 *
	 * @return {JSX.Element} Returns a TextInput component for an email field.
	 */
	const renderEmailFieldBody = (inputProps, _formState, actions) => {
		/**
		 * Handles the blur event to validate the email.
		 *
		 * @param {Object} event The event object.
		 */
		const handleBlur = (event) => {
			const isValid = isValidEmail(event.target.value);

			actions.setError(!isValid ? __('Please, enter a valid email address.', 'comment-notifications') : null);
		};

		return <TextInput type="email" onBlur={handleBlur} {...inputProps} />;
	};

	const emailRows = [
		{
			label: __('Sender name', 'comment-notifications'),
			name: 'sender_name',
			required: true,
			body: (inputProps) => <TextInput {...inputProps} />,
		},
		{
			label: __('From email address', 'comment-notifications'),
			name: 'from_email',
			body: renderEmailFieldBody,
		},
		{
			label: __('Reply to email address', 'comment-notifications'),
			name: 'reply_to',
			body: renderEmailFieldBody,
		},
	];

	const emailPreviewRows = [
		{
			label: __('Email preview', 'comment-notifications'),
			name: 'email_preview',
			body: (inputProps) => <EmailPreviewInline value={inputProps.value} />,
		},
	];

	return (
		<>
			<Form rows={emailRows} {...props} />
			<Form rows={emailPreviewRows} hideButtons={true} {...props} />
		</>
	);
};

EmailsForm.propTypes = {
	data: PropTypes.object.isRequired,
	onSubmit: PropTypes.func.isRequired,
};
