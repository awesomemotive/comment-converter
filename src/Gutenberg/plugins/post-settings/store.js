import apiFetch from '@wordpress/api-fetch';
import { createReduxStore, register } from '@wordpress/data';

const DEFAULT_STATE = {
	counts: {
		followers: null,
		subscribers: null,
	},
	isEmailRequired: null,
};

/**
 * The actions for the Comment Converter post settings store.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/#actions
 *
 * @type {Object}
 */
const actions = {
	/**
	 * Sets the counts for the current post.
	 *
	 * @since 0.9.1
	 *
	 * @param {Object} data The counts for the current post.
	 *
	 * @return {Object} The action to set the post counts in the store.
	 */
	setCounts(data) {
		return {
			type: 'SET_COUNTS',
			payload: {
				data,
			},
		};
	},

	/**
	 * Fetches data from the API.
	 *
	 * @since 0.9.1
	 *
	 * @param {string} path The path to fetch data from.
	 *
	 * @return {Object} The action to fetch data from the API.
	 */
	fetchFromAPI(path) {
		return {
			type: 'FETCH_FROM_API',
			payload: {
				path,
			},
		};
	},
};

/**
 * The Comment Converter post settings store.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/#registering-a-store
 *
 * @type {Object}
 */
export const store = createReduxStore('ccvtr/post-settings', {
	/**
	 * The reducer for the Comment Converter post settings store.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/#reducer
	 *
	 * @param {Object} state  The current state of the store.
	 * @param {Object} action The action to perform on the store.
	 *
	 * @return {Object} The new state of the store.
	 */
	reducer(state = DEFAULT_STATE, action) {
		switch (action.type) {
			case 'SET_COUNTS':
				const { is_email_required: isEmailRequired, subscribers, followers } = action.payload.data;

				return {
					...state,
					counts: {
						subscribers,
						followers,
					},
					isEmailRequired,
				};
		}

		return state;
	},

	actions,

	/**
	 * The selectors for the Comment Converter post settings store.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/#selectors
	 *
	 * @type {Object}
	 */
	selectors: {
		/**
		 * Gets the counts for the current post.
		 *
		 * @since 0.9.1
		 *
		 * @param {Object} state The current state of the store.
		 *
		 * @return {Object} The counts for the current post.
		 */
		getCounts(state) {
			return state;
		},
	},

	/**
	 * The controls for the Comment Converter post settings store.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/#controls
	 *
	 * @type {Object}
	 */
	controls: {
		/**
		 * Hooks into the FETCH_FROM_API action type to trigger a request to fetch data from the API.
		 *
		 * @since 0.9.1
		 *
		 * @param {Object} action      The action to perform on the store.
		 * @param {string} action.path The path to fetch data from.
		 *
		 * @return {Promise} A promise that resolves with the fetched data.
		 */
		FETCH_FROM_API(action) {
			return apiFetch({ path: action.payload.path });
		},
	},

	/**
	 * The resolvers for the Comment Converter post settings store.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/#resolvers
	 *
	 * @type {Object}
	 */
	resolvers: {
		/**
		 * Side-effect resolver to fetch the counts for the current post.
		 *
		 * @since 0.9.1
		 *
		 * @param {number} postId The ID of the current post.
		 *
		 * @return {Object} The action to set the post counts in the store.
		 */
		*getCounts(postId) {
			const path = '/ccvtr/v1/post-settings/' + postId;
			const data = yield actions.fetchFromAPI(path);
			return actions.setCounts(data);
		},
	},
});

register(store);
