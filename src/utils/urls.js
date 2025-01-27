const { internalAdminBaseUrl, adminBaseUrl, assetsUrl = '' } = window.ccData;

/**
 * The URL for the Comment Converter followers page in the WordPress admin.
 *
 * @type {string}
 */
export const followers = `${internalAdminBaseUrl}?page=comment-converter-followers`;

export const discussionSettings = `${adminBaseUrl}options-discussion.php`;

/**
 * Returns a URL for the given path relative to the plugin's assets directory.
 *
 * @param {string} path Path relative to the plugin's assets directory.
 *
 * @return {string} URL for the given path relative to the plugin's assets directory.
 */
export const assets = (path) => {
	return `${assetsUrl}${path}`;
};

/**
 * Returns a URL for the given path relative to the Comment Converter marketing site.
 *
 * @param {string} path Path relative to the Comment Converter marketing site.
 *
 * @return {string} URL for the given path relative to the Comment Converter marketing site.
 */
export const marketing = (path = '') => {
	let url = process?.env?.CCVTR_MARKETING_URL || 'https://commentconverter.com';

	if (path) {
		url += '/' + path;
	}

	return url;
};

/**
 * Returns a URL for the upgrade URL to the Comment Converter marketing site.
 *
 * @param {Object} utmArgs UTM parameters to append to the URL.
 *
 * @return {string} URL for the upgrade URL to the Comment Converter marketing site.
 */
export const upgrade = (utmArgs = {}) => {
	const args = {
		utmSource: 'plugin',
		...utmArgs,
	};

	// User data.
	const user = {
		first: encodeURIComponent(window?.ccData?.loggedInUserData.first_name ?? ''),
		last: encodeURIComponent(window?.ccData?.loggedInUserData.last_name ?? ''),
		email: encodeURIComponent(window?.ccData?.loggedInUserData.email ?? ''),
		domain: encodeURIComponent(window?.ccData?.loggedInUserData.domain ?? ''),
	};

	let utmParams = `utm_source=${args.utmSource}`;

	if (args.utmMedium) {
		utmParams += `&utm_medium=${args.utmMedium}`;
	}

	const wpfParams = `wpf14180386_1|first=${user.first}&wpf14180386_1|last=${user.last}&wpf14180386_2=${user.email}&wpf14180386_3=${user.domain}`;

	return `${adminBaseUrl}admin.php?page=comment-converter-upgrade&${utmParams}&${wpfParams}`;
};

export const video = {
	gettingStarted: 'https://www.youtube.com/embed/5jdm8gv-vbc?si=ox9qo_WhiSLdY9gm',
};
