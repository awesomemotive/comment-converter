import { PageBody } from '../Common/Layout/PageBody';
import { EmailsForm } from '../Common/Form/EmailsForm';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../store/localApi';
import { Loading } from '../Common/Layout/Loading';
import { Alert } from '../Common/Alert/Alert';
import { parseErrorResponse } from '../utils/error';

export const Emails = () => {
	const { data, error, isLoading } = useGetSettingsQuery();

	const [updateSettings, updateSettingsResult] = useUpdateSettingsMutation();

	if (isLoading || error) {
		return <PageBody>{isLoading ? <Loading /> : <Alert type="error">{parseErrorResponse(error)}</Alert>}</PageBody>;
	}

	/**
	 * Handles the saving of settings for the emails form.
	 *
	 * @since 0.9.1
	 *
	 * @param {Object} emails - The settings for the emails form.
	 */
	const handleSaveSettings = async (emails) => {
		updateSettings({
			...data,
			emails: {
				...data.emails,
				...emails,
			},
		});
	};

	return (
		<PageBody>
			<EmailsForm data={data.emails} onSubmit={handleSaveSettings} submissionStatus={updateSettingsResult} />
		</PageBody>
	);
};
