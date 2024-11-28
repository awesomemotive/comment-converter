import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { TextInput } from '../Inputs/TextInput';
import { YesNoSwitch } from '../Inputs/YesNoSwitch';
import { CheckboxGroup } from '../Inputs/CheckboxGroup';
import { RadioButtonGroup } from '../Inputs/RadioButtonGroup';
// import { FileInput } from '../Inputs/FileInput';
import { ColorInput } from '../Inputs/ColorInput';
import { TextListInput } from '../Inputs/TextListInput';
import { Form } from './Form';
import { buildFollowingBadgeOptions, getPostTypeOptions } from '../dropdownValues';
import { isValidEmail } from '../../Lib/util/email';
// import { RadioButtonInput } from '../Inputs/RadioButtonInput';

export const OptionsForm = (props) => {
	const rows = [
		{
			// translators: Comment Converter is the name of the plugin.
			label: __('Enable Comment Converter on these types of content', 'comment-notifications'),
			name: 'enabled_post_types',
			required: true,
			body: (inputProps) => <CheckboxGroup {...inputProps} options={getPostTypeOptions()} />,
		},
		{
			label: __('Follower dashboard slug', 'comment-notifications'),
			name: 'follower_dashboard_page_path',
			required: true,
			body: (inputProps) => <TextInput {...inputProps} className="w-full" />,
		},
		{
			label: __('Following badge', 'comment-notifications'),
			name: 'following_badge_path',
			body: (inputProps, formState) => {
				// Give preference to the currently uploaded badge, then fallback to the one saved in the settings already.
				/* const uploadedBadgeSrc =
					formState.following_badge_upload instanceof File
						? URL.createObjectURL(formState.following_badge_upload)
						: formState.following_badge_uploaded_path; */
				return (
					<div>
						<span className="text-sm text-primaryText">
							{__('Default Icons', 'comment-notifications')}
							<span className="ml-2 text-xs italic text-primaryText100">
								{__('Customize the color of default icons', 'comment-notifications')}
							</span>
						</span>
						<div className="flex my-2">
							<RadioButtonGroup
								{...inputProps}
								className="flex gap-2"
								options={buildFollowingBadgeOptions(formState.following_badge_color)}
							/>
							<ColorInput
								className="ml-2 rtl:!ml-0 rtl:mr-2"
								label={__('Following badge color', 'comment-notifications')}
								labelHidden={true}
								name="following_badge_color"
								value={formState.following_badge_color}
								onChange={inputProps.onChange}
							/>
						</div>
						{/* {uploadedBadgeSrc ? (
							<>
								<span className="inline-block mt-6 text-sm text-primaryText">
									{__('Uploaded Icon', 'comment-notifications')}
								</span>
								<div className="flex mt-2">
									<RadioButtonInput
										checked={uploadedBadgeSrc === formState.following_badge_path}
										className="flex gap-2"
										label={<img src={uploadedBadgeSrc} />}
										name="following_badge_path"
										onChange={inputProps.onChange}
										value={uploadedBadgeSrc}
									/>
								</div>
							</>
						) : null}
						<FileInput
							className="mt-4"
							buttonText={__('Upload Image', 'comment-notifications')}
							label={__('Following badge upload', 'comment-notifications')}
							labelHidden={true}
							name="following_badge_upload"
							placeholder={__('(recommended image size 64 x 64 px)', 'comment-notifications')}
							value={
								formState.following_badge_upload instanceof File ? formState.following_badge_upload : null
							}
							onChange={inputProps.onChange}
						/> */}
					</div>
				);
			},
		},
		{
			label: __('Enable double opt-in', 'comment-notifications'),
			name: 'is_double_optin_enabled',
			body: (inputProps, formState) => (
				<YesNoSwitch {...inputProps} value="yes" checked={!!formState.is_double_optin_enabled} />
			),
		},
		{
			label: __('Enable author engagement', 'comment-notifications'),
			name: 'should_authors_auto_follow',
			helpText: __('Automatically subscribe Authors to comments and replies to their own articles.', 'comment-notifications'),
			body: (inputProps, formState) => (
				<YesNoSwitch {...inputProps} value="yes" checked={!!formState.should_authors_auto_follow} />
			),
		},
		{
			label: __('Allow only logged in users to follow', 'comment-notifications'),
			name: 'allow_only_logged_in_users',
			body: (inputProps, formState) => (
				<YesNoSwitch {...inputProps} value="yes" checked={!!formState.allow_only_logged_in_users} />
			),
		},
		/* {
			label: __('Display powered by logo', 'comment-notifications'),
			name: 'display_powered_by_logo',
			body: (inputProps, formState) => (
				<YesNoSwitch {...inputProps} value="yes" checked={!!formState.display_powered_by_logo} />
			),
		},
		{
			label: __('Affiliate URL', 'comment-notifications'),
			name: 'affiliate_url',
			body: (inputProps) => <TextInput {...inputProps} />,
		}, */
		{
			label: __('Disallow List', 'comment-notifications'),
			name: 'blocklisted_emails',
			body: (inputProps, _formState, actions) => {
				/**
				 * Handles the checking of the email.
				 *
				 * @param {string} newEmail The email to be checked.
				 *
				 * @return {boolean} Returns true if the email is valid, false otherwise.
				 */
				const handleCheckEmail = (newEmail) => {
					const isValid = isValidEmail(newEmail);

					actions.setError(!isValid ? __('Only valid emails are allowed.', 'comment-notifications') : null);

					return isValid;
				};

				return (
					<TextListInput
						{...inputProps}
						buttonText={__('Add Email', 'comment-notifications')}
						onBeforeChange={handleCheckEmail}
					/>
				);
			},
		},
	];

	return <Form rows={rows} {...props} />;
};

OptionsForm.propTypes = {
	data: PropTypes.object.isRequired,
	onSubmit: PropTypes.func.isRequired,
};
