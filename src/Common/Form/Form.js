import { useEffect, useState } from '@wordpress/element';
import { usePrevious } from '../../Lib/hooks/usePrevious';
import isEqual from 'lodash/isEqual';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tw from 'twin.macro';
import { WhiteBox } from '../Layout/WhiteBox';
import { InputLabelWrapper } from '../Inputs/InputLabelWrapper';
import { HelpTip } from '../Tooltip/HelpTip';
import { SubmitButton } from './SubmitButton';
import { Alert } from '../Alert/Alert';
import { parseErrorResponse } from '../../utils/error';
import { SecondaryButton } from '../Buttons/BaseButton';

const Wrapper = styled(WhiteBox)`
	.xTextInput--label-left,
	.xYesNoSwitch--label-left {
		${tw`w-full`}

		> span {
			${tw`w-[258px]`}
		}

		> div {
			flex: 1;
		}
	}
`;

const StyledHelpTip = styled(HelpTip)`
	.tippy-box {
		${tw`bg-primaryText font-normal !max-w-[450px]`}
	}

	.HelpTip--iconWrapper {
		${tw`relative top-0.5`}
	}
`;

export const Form = (props) => {
	const { data, rows, onSubmit, submissionStatus, hideButtons = false } = props;

	const prevData = usePrevious(data);
	const [formState, setFormState] = useState(data);
	const [formErrors, setFormErrors] = useState({});

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
	const handleSubmit = () => {
		onSubmit(formState);
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
		<Wrapper className="w-full mb-8">
			{rows.map((row, i) => {
				const { name, label, belowLabel, required = false } = row;

				/**
				 * Handle setting the error state for a field.
				 *
				 * @param {string} error The error message or null to reset the error.
				 */
				const setError = (error) => {
					setFormErrors({
						...formErrors,
						[name]: error,
					});
				};

				return (
					<div key={i} className="flex flex-row w-full pb-4 mb-4 border-b border-neutral40">
						<div className="w-[300px]">
							<div className="w-[280px]" style={{ textWrap: 'balance' }}>
								<InputLabelWrapper>
									{label}
									&nbsp;
									{row.helpText ? (
										<StyledHelpTip className="!inline-block" content={row.helpText} />
									) : null}
								</InputLabelWrapper>
							</div>
							{belowLabel ? <div>{belowLabel(formState)}</div> : null}
						</div>
						<div className="grow">
							{row.body(
								{
									label,
									labelHidden: true,
									name,
									onChange: handleFormChange,
									value: formState[name],
								},
								formState,
								{
									setError,
								}
							)}
							{formErrors[name] && (
								<Alert className="mt-2.5" type="error">
									{formErrors[name]}
								</Alert>
							)}
							{(!formState[name] || (Array.isArray(formState[name]) && !formState[name].length)) &&
								required && (
									<Alert className="mt-2.5" type="error">
										{__('Invalid empty value.', 'comment-notifications')}
									</Alert>
								)}
						</div>
					</div>
				);
			})}
			{!hideButtons && (
				<div className="flex flex-col items-start pl-[300px] rtl:!pl-0 rtl:pr-[300px]">
					<div className="flex flex-row items-center">
						<SubmitButton onSubmit={handleSubmit} submissionStatus={submissionStatus}>
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
			)}
		</Wrapper>
	);
};

Form.propTypes = {
	data: PropTypes.object.isRequired,
	hideButtons: PropTypes.bool,
	onSubmit: PropTypes.func.isRequired,
	rows: PropTypes.arrayOf(
		PropTypes.shape({
			belowLabel: PropTypes.any,
			body: PropTypes.any.isRequired,
			label: PropTypes.string.isRequired,
			name: PropTypes.string,
		})
	).isRequired,
	submissionStatus: PropTypes.shape({
		error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		isError: PropTypes.bool,
		isLoading: PropTypes.bool,
		isSuccess: PropTypes.bool,
		reset: PropTypes.func,
	}),
};
