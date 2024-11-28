import { __ } from '@wordpress/i18n';
import { PageBody } from '../Common/Layout/PageBody';
import { CommentFormForm } from '../Common/Form/CommentFormForm';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../store/localApi';
import { Loading } from '../Common/Layout/Loading';
import { Alert } from '../Common/Alert/Alert';
import { parseErrorResponse } from '../utils/error';

export const CommentForm = () => {
	const { data, error, isLoading } = useGetSettingsQuery();

	const [updateSettings, updateSettingsResult] = useUpdateSettingsMutation();

	if (isLoading || error) {
		return <PageBody>{isLoading ? <Loading /> : <Alert type="error">{parseErrorResponse(error)}</Alert>}</PageBody>;
	}

	/**
	 * Handles the saving of settings for the comment form.
	 *
	 * @since 0.9.1
	 *
	 * @param {Object} comment_form - The settings for the comment form.
	 */
	const handleSaveSettings = (comment_form) => {
		updateSettings({
			...data,
			comment_form: {
				...data.comment_form,
				...comment_form,
			},
		});
	};

	return (
		<PageBody>
			<CommentFormForm
				data={data.comment_form}
				onSubmit={handleSaveSettings}
				submissionStatus={updateSettingsResult}
			/>
		</PageBody>
	);
};
