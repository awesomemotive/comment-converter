import { useMemo } from 'react';
import debounce from 'lodash/debounce';

/**
 * Hook to create a debounced callback using `lodash.debounce`.
 *
 * NOTE: The `callback` shouldn't change often. If you're passing a callback
 * that is created inside a function component, you will need to memoize this
 * callback with `useMemo` or `useCallback`. See `handleOnKeyUp` in
 * src/Components/Inputs/TextInputBase.js.
 *
 * @param {Function} callback The callback being debounced.
 * @param {number}   wait     The debounce wait time.
 *
 * @return {Function} The memoized debounce function.
 */
export function useLodashDebounce(callback, wait) {
	return useMemo(() => debounce((...args) => callback(...args), wait), [callback, wait]);
}
