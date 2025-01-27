import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { TextInput } from '../Inputs/TextInput';
import { Form } from './Form';
import { ShortcodeList } from './ShortcodeList';
import { TextareaInput } from '../Inputs/TextareaInput';

export const CommentFormForm = (props) => {
	const rows = [
		{
			label: __('Follower dashboard link text', 'subscribe-to-comment-notifications-comment-converter'),
			name: 'follower_dashboard_link_text',
			required: true,
			body: (inputProps) => <TextInput {...inputProps} />,
		},
		{
			label: __('After commenting', 'subscribe-to-comment-notifications-comment-converter'),
			name: 'notification_after_commenting',
			required: true,
			body: (inputProps) => <TextareaInput {...inputProps} />,
		},
		{
			label: __('After following (single opt-in)', 'subscribe-to-comment-notifications-comment-converter'),
			name: 'notification_after_following_single_opt_in',
			required: true,
			body: (inputProps) => <TextareaInput {...inputProps} />,
		},
		{
			label: __('After following (double opt-in)', 'subscribe-to-comment-notifications-comment-converter'),
			name: 'notification_after_following_double_opt_in',
			required: true,
			body: (inputProps) => <TextareaInput {...inputProps} />,
		},
		/*{
			label: __('After subscribing', 'subscribe-to-comment-notifications-comment-converter'),
			name: 'notification_after_subscribing',
			body: (inputProps) => <TextareaInput {...inputProps} />,
		},
 		{
			label: __('After following and subscribing (single opt-in)', 'subscribe-to-comment-notifications-comment-converter'),
			name: 'notification_after_following_and_subscribing_single_opt_in',
			body: (inputProps) => <TextareaInput {...inputProps} />,
		},
		{
			label: __('After following and subscribing (double opt-in)', 'subscribe-to-comment-notifications-comment-converter'),
			name: 'notification_after_following_and_subscribing_double_opt_in',
			body: (inputProps) => <TextareaInput {...inputProps} />,
		},
		{
			label: __('After unsubscribing', 'subscribe-to-comment-notifications-comment-converter'),
			name: 'notification_after_unsubscribing',
			body: (inputProps) => <TextareaInput {...inputProps} />,
		}, */
		{
			label: __('Shortcodes', 'subscribe-to-comment-notifications-comment-converter'),
			body: () => <ShortcodeList />,
		},
	];

	return <Form rows={rows} {...props} />;
};

CommentFormForm.propTypes = {
	data: PropTypes.object.isRequired,
	onSubmit: PropTypes.func.isRequired,
};
