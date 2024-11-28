import { Fragment, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { TextInput } from '../Inputs/TextInput';
import { SelectInput } from '../Inputs/SelectInput';
import { usePrevious } from '../../Lib/hooks/usePrevious';
import isEqual from 'lodash/isEqual';
import { followTypeOptions, notificationFrequencyOptions } from '../dropdownValues';
import { SubmitButton } from './SubmitButton';
import { Alert } from '../Alert/Alert';
import { parseErrorResponse } from '../../utils/error';
import { SecondaryButton } from '../Buttons/BaseButton';

export const FollowerForm = (props) => {
	const { data, onSave, submissionStatus } = props;
	const prevData = usePrevious(data);

	const [formState, setFormState] = useState(data);

	useEffect(() => {
		if (!isEqual(data, prevData)) {
			setFormState(data);
		}
	}, [data, prevData]);

	/**
	 * Handles changes to the form fields.
	 *
	 * @since 0.9.1
	 *
	 * @param {any}    value The new value of the field.
	 * @param {string} name  The name of the field.
	 *
	 * @return {void}
	 */
	const handleFormChange = (value, name) => {
		setFormState({
			...formState,
			[name]: value,
		});
	};

	/**
	 * Handles saving the form.
	 *
	 * @since 0.9.1
	 *
	 * @return {void}
	 */
	const handleFormSave = () => {
		onSave(formState);
	};

	/**
	 * Handles reseting the form.
	 *
	 * @since 0.9.1
	 *
	 * @return {void}
	 */
	const handleCancel = () => {
		setFormState(data);
		submissionStatus.reset();
	};

	return (
		<Fragment>
			<div className="flex flex-row w-full gap-6 mb-4">
				<div className="flex w-1/2">
					<TextInput
						className="w-full"
						label={__('Name', 'comment-notifications')}
						name="name"
						value={formState.name}
						onChange={handleFormChange}
					/>
				</div>
				<div className="flex w-1/2">
					<SelectInput
						className="w-full"
						label={__('Default follow setting', 'comment-notifications')}
						name="default_follow_type"
						value={formState.default_follow_type}
						options={followTypeOptions}
						onChange={handleFormChange}
					/>
				</div>
			</div>
			<div className="flex flex-row w-full gap-6 mb-4">
				<div className="flex w-1/2">
					<TextInput
						className="w-full"
						label={__('Notification email', 'comment-notifications')}
						type="email"
						name="notification_email"
						value={formState.notification_email}
						onChange={handleFormChange}
					/>
				</div>
				<div className="flex w-1/2">
					<SelectInput
						className="w-full"
						label={__('Notification frequency', 'comment-notifications')}
						name="notification_frequency"
						value={formState.notification_frequency}
						options={notificationFrequencyOptions}
						onChange={handleFormChange}
					/>
				</div>
			</div>
			<div className="flex flex-col items-start">
				<div className="flex flex-row items-center">
					<SubmitButton onSubmit={handleFormSave} submissionStatus={submissionStatus}>
						{__('Update Settings', 'comment-notifications')}
					</SubmitButton>
					<SecondaryButton onClick={handleCancel} className="ml-[5px] rtl:!ml-0 rtl:mr-[5px]">
						{__('Cancel', 'comment-notifications')}
					</SecondaryButton>
				</div>
				{submissionStatus?.isError && (
					<Alert className="mt-2.5" type="error">
						{parseErrorResponse(submissionStatus.error)}
					</Alert>
				)}
			</div>
		</Fragment>
	);
};

FollowerForm.propTypes = {
	data: PropTypes.object.isRequired,
	onSave: PropTypes.func.isRequired,
	submissionStatus: PropTypes.shape({
		error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		isError: PropTypes.bool,
		isLoading: PropTypes.bool,
		isSuccess: PropTypes.bool,
		reset: PropTypes.func,
	}),
};
