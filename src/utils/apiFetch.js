import { default as wpApiFetch } from '@wordpress/api-fetch';

/**
 * Fetches data from the API.
 *
 * It works as a wrapper to WordPress's apiFetch function, but adding the ccvtr namespace to the path.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/api-fetch/src/index.js
 *
 * @since 0.9.1
 *
 * @param {Object}  args                 The arguments for the API fetch.
 * @param {string}  args.path            The path of the API endpoint.
 * @param {string}  [args.method='GET']  The HTTP method to use.
 * @param {Object}  args.body            The body of the request.
 * @param {boolean} [args.useBody=false] Whether to use the body as is, or to encode it as JSON.
 * @param {Object}  args.rest            The rest of the arguments.
 *
 * @return {Promise} Returns a promise that resolves to the response of the API fetch.
 */
export function apiFetch(args) {
	const { path, method, body, useBody = false, ...rest } = args;

	const options = {};

	if (useBody) {
		// useBody is useful for when you don't want a JSON payload liek when uploading files.
		options.body = body;
	} else {
		// Adding the body as to the data property will automatically encode it as JSON and
		// add a JSON content type header.
		options.data = body;
	}

	return wpApiFetch({
		path: `ccvtr/${path}`,
		method: method || 'GET',
		...rest,
		...options,
	});
}
