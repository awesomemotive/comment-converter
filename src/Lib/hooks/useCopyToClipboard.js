import { useState } from 'react';
import get from 'lodash/get';

/**
 * Hook to copy text to the clipboard using Clipboard API.
 *
 * @return {Object} The copy text data.
 */
export function useCopyTextToClipboard() {
	const [copied, setCopied] = useState(false);

	const setTempCopied = () => {
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 3000);
	};

	const copyText = (text) => {
		// If the browser doesn't support the clipboard API, bail. This is not
		// likely to be the case these days, but this will at least prevent the
		// app from breaking and throwing errors.
		if (typeof get(window.navigator, 'clipboard.writeText') !== 'function') {
			const textarea = document.createElement('textarea');
			textarea.textContent = text;
			textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
			document.body.appendChild(textarea);
			textarea.select();
			try {
				return document.execCommand('copy'); // Security exception may be thrown by some browsers.
			} catch (ex) {
				console.warn('Copy to clipboard failed.', ex);
				return false;
			} finally {
				document.body.removeChild(textarea);

				setTempCopied();
			}
		}

		// Add text to the clipboard via Clipboard API.
		navigator.clipboard.writeText(text).then(setTempCopied);
	};

	return { copied, copyText, setCopied };
}
