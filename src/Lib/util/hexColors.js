import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import get from 'lodash/get';

/**
 * Returns true if a string is a valid hex color. Returns true even if hash (#)
 * is not included.
 *
 * @param {string} string The string to test.
 *
 * @return {boolean} True if string is hex color.
 */
export const isHex = (string) => {
	const regex = RegExp('^(#?)([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$');
	return isString(string) && regex.test(string);
};

/**
 * Returns true if a string is a valid shorthand hex color. Returns true even if hash (#)
 * is not included.
 *
 * @param {string}  string    The string to test.
 * @param {boolean} withAlpha Whether to check alpha shorthand.
 *
 * @return {boolean} True if string is shorthand hex color.
 */
export const isHexShorthand = (string, withAlpha = false) => {
	if (!isString(string)) {
		return false;
	}

	const length = withAlpha ? 4 : 3;
	const regex = RegExp('^(#?)([A-Fa-f0-9]{' + length + '})$');

	return regex.test(string);
};

/**
 * Returns true if a string is a valid rgba color.
 *
 * @param {string} string The string to test.
 *
 * @return {boolean} True if string is rgba color.
 */
export const isRgba = (string) => {
	return isString(string) && 0 === string.indexOf('rgba(');
};

/**
 * Determine if given color is a hex or rgb color mode.
 *
 * @param {string|Object} value Color string or object.
 *
 * @return {string} Whether given color is a hex or rgb color.
 */
export const getColorMode = (value) => {
	if (isRgba(value)) {
		return 'rgb';
	}

	if (isObject(value)) {
		if (get(value, 'rgb.a')) {
			return 'rgb';
		}

		return get(value, 'hex') && 'hex' === get(value, 'source') ? 'hex' : 'rgb';
	}

	return 'hex';
};

/**
 * Converts a rgba color string to an object of RGBA values.
 *
 * Expects a valid rgba value.
 *
 * @param {string} string The rgba color string.
 *
 * @return {Object} The RGBA values object.
 */
export const rgbaToRgbARaw = (string) => {
	const parts = string
		.replace('rgba(', '')
		.replace(')', '')
		.split(',')
		.map((s) => s.trim());

	return {
		r: parseFloat(parts[0] || 0),
		g: parseFloat(parts[1] || 0),
		b: parseFloat(parts[2] || 0),
		a: parseFloat(parts[3] || 1),
	};
};

/**
 * Returns a normalized hex color string. If the string is not a valid hex
 * color, the original string is returned.
 *
 * @param {string} string The string to normalize.
 *
 * @return {string} Normalized hex code if hex color, otherwise, original string.
 */
export const normalizeHex = (string) => {
	const trimmed = string.trim();
	return isHex(trimmed) ? `#${trimmed.replace('#', '')}` : string;
};

/**
 * Converts a hex color string to an object of RGBA values.
 *
 * Expects a valid hex value.
 *
 * See {@link https://css-tricks.com/converting-color-spaces-in-javascript/}
 *
 * @param {string} string The hex color.
 *
 * @return {Object} The RGBA values object.
 */
export const hexToRgbARaw = (string) => {
	if (isRgba(string)) {
		return rgbaToRgbARaw(string);
	}

	const hex = normalizeHex(string);

	let r = 0;
	let g = 0;
	let b = 0;
	let a = 1;

	if (hex.length === 4) {
		// Handling 3 digit hex (#RGB).
		r = '0x' + hex[1] + hex[1];
		g = '0x' + hex[2] + hex[2];
		b = '0x' + hex[3] + hex[3];
	} else if (hex.length === 5) {
		// Handling 4 digit hex (#RGBA).
		r = '0x' + hex[1] + hex[1];
		g = '0x' + hex[2] + hex[2];
		b = '0x' + hex[3] + hex[3];
		a = '0x' + hex[4] + hex[4];
		a = +(a / 255).toFixed(3);
	} else if (hex.length === 7) {
		// Handling 6 digit hex (#RRGGBB).
		r = '0x' + hex[1] + hex[2];
		g = '0x' + hex[3] + hex[4];
		b = '0x' + hex[5] + hex[6];
	} else if (hex.length === 9) {
		// Handling 6 digit hex (#RRGGBBAA).
		r = '0x' + hex[1] + hex[2];
		g = '0x' + hex[3] + hex[4];
		b = '0x' + hex[5] + hex[6];
		a = '0x' + hex[7] + hex[8];
		a = +(a / 255).toFixed(3);
	}

	return { r: +r, g: +g, b: +b, a };
};

/**
 * Converts a hex color string to an RGB CSS declaration.
 *
 * Ex: `hexToRgb('#FFFFFF')` returns `rgb(255, 255, 255)`
 *
 * @param {string} string The hex color string.
 *
 * @return {string} The converted RGB CSS declaration.
 */
export const hexToRgb = (string) => {
	if (!isHex(string.trim())) {
		return string;
	}

	const rgbObj = hexToRgbARaw(string);

	return `rgb(${+rgbObj.r}, ${+rgbObj.g}, ${+rgbObj.b})`;
};

/**
 * Converts a hex color string to an RGB CSS declaration.
 *
 * Ex: `hexToRgbA('#FFFFFF', '0.15')` returns `rgb(255, 255, 255, 0.15)`
 *
 * @param {string}        string The hex color string.
 * @param {string|number} alpha  The alpha value.
 *
 * @return {string} The converted RGB CSS declaration.
 */
export const hexToRgbA = (string, alpha = 1) => {
	if (!isHex(string.trim())) {
		return string;
	}

	const rgbObj = hexToRgbARaw(string);

	return `rgba(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b}, ${alpha})`;
};

/**
 * Converts a percent value to an HEX value.
 *
 * @param {number} p The percent value (0 to 100%).
 *
 * @return {string} The HEX value for the provided percent value.
 */
export const percentToHex = (p) => {
	const percent = Math.max(0, Math.min(100, p)); // bound percent from 0 to 100
	const intValue = Math.round((percent / 100) * 255); // map percent to nearest integer (0 - 255)
	const hexValue = intValue.toString(16); // get hexadecimal representation
	return hexValue.padStart(2, '0').toUpperCase(); // format with leading 0 and upper case characters
};
