import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { PageBody } from '../Common/Layout/PageBody';
import { OptionsForm } from '../Common/Form/OptionsForm';
import { useGetSettingsQuery, useUpdateSettingsMutation, useUploadFileMutation } from '../store/localApi';
import { Loading } from '../Common/Layout/Loading';
import { Alert } from '../Common/Alert/Alert';
import { parseErrorResponse } from '../utils/error';

export const Options = () => {
	const { data, error, isLoading } = useGetSettingsQuery();

	const [updateSettings, updateSettingsResult] = useUpdateSettingsMutation();

	const [uploadFile] = useUploadFileMutation();

	const [uploadResult, setUploadResult] = useState(null);

	if (isLoading || error) {
		return <PageBody>{isLoading ? <Loading /> : <Alert type="error">{parseErrorResponse(error)}</Alert>}</PageBody>;
	}

	/**
	 * Handles the saving of settings for the options form.
	 *
	 * @since 0.9.1
	 *
	 * @param {Object} general - The settings for the options form.
	 */
	const handleSaveSettings = async (general) => {
		if (general.following_badge_upload && general.following_badge_upload instanceof File) {
			try {
				setUploadResult({
					isLoading: true,
				});

				const resp = await uploadFile({
					file: general.following_badge_upload,
					path: 'options-following-badge',
				}).unwrap();
				// This property holds the path for the selected badge.
				general.following_badge_path = resp.url;

				// This property holds the path for the uploaded badge. We need to keep this, in case the user selects
				// a different badge, so we don't loose the path to the uploaded badge, incase the user might want to
				// re-select it in the future.
				general.following_badge_uploaded_path = resp.url;

				setUploadResult(null);
			} catch (err) {
				setUploadResult({
					...uploadResult,
					error: err,
					isError: true,
				});
				return;
			}

			// The upload file is not needed in the settings.
			delete general.following_badge_upload;
		}

		updateSettings({
			...data,
			general: {
				...data.general,
				...general,
			},
		});
	};

	const submissionStatus = uploadResult
		? {
				...uploadResult,
				reset: () => setUploadResult(null),
			}
		: updateSettingsResult;

	return (
		<PageBody>
			<OptionsForm data={data.general} onSubmit={handleSaveSettings} submissionStatus={submissionStatus} />
		</PageBody>
	);
};
