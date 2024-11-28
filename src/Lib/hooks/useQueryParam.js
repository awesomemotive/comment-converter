import { useSearchParams } from 'react-router-dom';

/**
 * A custom hook for managing query parameters in the URL.
 *
 * @param {string} name         The name of the query parameter.
 * @param {*}      defaultValue The default value for the query parameter.
 *
 * @return {Array} An array with the current value of the query parameter and a function to update it.
 */
export function useQueryParam(name, defaultValue = null) {
	const [searchParams, setSearchParams] = useSearchParams();

	const value = searchParams.has(name) ? searchParams.get(name) : defaultValue;

	const setValue = (newValue) => {
		setSearchParams((prev) => {
			// If newValue is an object, iterate over it and set each key-value pair
			if (typeof newValue === 'object' && newValue !== null) {
				for (const [key, value] of Object.entries(newValue)) {
					if (value) {
						prev.set(key, value);
					} else {
						prev.delete(key);
					}
				}
			} else if (newValue) {
				prev.set(name, newValue);
			} else {
				prev.delete(name);
			}

			return prev;
		});
	};

	return [value, setValue];
}
