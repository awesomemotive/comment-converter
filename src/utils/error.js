import { __ } from '@wordpress/i18n';

/**
 * Parses an error response and returns a string representation of the error.
 *
 * @param {string|Object} error The error to parse.
 *
 * @return {string} A string representation of the error.
 */
export const parseErrorResponse = (error) => {
	if (error && typeof error === 'string') {
		return error;
	}

	if (error?.message) {
		return error.message;
	}

	if (error?.error) {
		return error.error;
	}

	return __('An error occurred.', 'subscribe-to-comment-notifications-comment-converter');
};
