import PropTypes from 'prop-types';
import { TextInput } from '../Inputs/TextInput';
import { SubmitButton } from './SubmitButton';
import { __ } from '@wordpress/i18n';
import tw from 'twin.macro';
import styled from 'styled-components';
import { useSendTestEmailMutation } from '../../store/localApi';
import { useState } from 'react';
import { parseErrorResponse } from '../../utils/error';
import { Alert } from '../Alert/Alert';
import { isValidEmail } from '../../Lib/util/email';

const StyledTextInput = styled(TextInput)`
	& > span {
		${tw`font-normal text-primaryText`};
	}
`;

export function EmailPreviewInline(props) {
	const { value } = props;
	const [email, setEmail] = useState();
	const [isInvalid, setInvalid] = useState(false);
	const [sendTestEmail, sendTestEmailResult] = useSendTestEmailMutation();

	/**
	 * Handles the "Send Test Email" form submission.
	 *
	 * @return {void}
	 */
	const handleSubmit = () => {
		if (!email || !isValidEmail(email)) {
			setInvalid(true);
			return;
		}

		setInvalid(false);
		sendTestEmail(email);
	};

	return (
		<div className="grow">
			<div className="mb-4">
				<div className="flex flex-row items-end">
					<StyledTextInput
						className="text-xs text-primaryText"
						label={__('Send a test email:', 'comment-notifications')}
						onChange={setEmail}
						placeholder={__('Enter your email…', 'comment-notifications')}
						value={email}
						size="medium"
					/>
					<SubmitButton
						className="ml-2 rtl:!ml-0 rtl:mr-2 text-base"
						onSubmit={handleSubmit}
						submissionStatus={sendTestEmailResult}
					>
						{__('Send Test Email', 'comment-notifications')}
					</SubmitButton>
				</div>
				{sendTestEmailResult?.isError && (
					<Alert className="mt-2.5" type="error">
						{parseErrorResponse(sendTestEmailResult.error)}
					</Alert>
				)}
				{isInvalid && (
					<Alert className="mt-2.5" type="error">
						{__('Please, enter a valid email address.', 'comment-notifications')}
					</Alert>
				)}
			</div>
			<div className="rounded-[3px] border border-neutral40" dangerouslySetInnerHTML={{ __html: value }} />
		</div>
	);
}

EmailPreviewInline.propTypes = {
	value: PropTypes.string.isRequired,
};
