/**
 * Decodes HTML entities in a string.
 *
 * This function creates a temporary textarea HTML element, sets its innerHTML to the provided HTML string,
 * which automatically decodes the HTML entities, and then returns the value of the textarea, which is the
 * decoded string.
 *
 * @since 0.9.1
 *
 * @param {string} html - The HTML string to decode.
 *
 * @return {string} The decoded string.
 */
export const decodeHtml = (html) => {
	// https://stackoverflow.com/questions/7394748/whats-the-right-way-to-decode-a-string-that-has-special-html-entities-in-it?lq=1
	const text = document.createElement('textarea');
	text.innerHTML = html;
	return text.value;
};
