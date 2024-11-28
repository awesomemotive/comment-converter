import { __ } from '@wordpress/i18n';
import { useLocation } from 'react-router-dom';
import { Alert } from '../Common/Alert/Alert';

const msgByPage = {
	confirm: __('You have successfully confirmed your follow.', 'comment-notifications'),
	unsubscribe: __('You have successfully unsubscribed from this post.', 'comment-notifications'),
};

export const OutputMessage = (props) => {
	const { error: frontError, ...rest } = props;
	const { error: serverError } = window.ccData;

	const error = frontError || serverError;

	const location = useLocation();
	const page = location.pathname.replace(/^\//, '');

	if (error) {
		return (
			<Alert type="error" {...rest}>
				{error}
			</Alert>
		);
	}

	if (!msgByPage[page]) {
		return null;
	}

	return (
		<Alert type="info" {...rest}>
			{msgByPage[page]}
		</Alert>
	);
};
