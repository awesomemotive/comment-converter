/**
 * Checks for a valid email address.
 *
 * Avoids ReDos: https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS
 * Inspired by: https://github.com/sindresorhus/email-regex/blob/9a355500c11834ff7461e60d84c4bdfdca0187e2/index.js#L1
 *
 * @param {string} email Email address to validate.
 *
 * @return {boolean} Whether or not the email address is valid.
 */
export function isValidEmail(email) {
	return new RegExp(/^[^.\s@:](?:[^\s@:]*[^\s@:.])?@[^.\s@]+\.[^.\s@]{2,}(?:\.[^.\s@]{2,})*$/).test(email);
}
