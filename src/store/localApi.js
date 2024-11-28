import { createApi } from '@reduxjs/toolkit/query/react';
import { addQueryArgs } from '@wordpress/url';
import pick from 'lodash/pick';
import snakeCase from 'lodash/snakeCase';
import { apiFetch } from '../utils/apiFetch';

/**
 * A custom base query function for use with RTK Query.
 *
 * This custom base query uses the `apiFetch` function from the WordPress, which
 * knows how to handle the WP API and authentication.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#implementing-a-custom-basequery
 *
 * @since 0.9.1
 *
 * @param {Object} args The arguments for the AJAX call.
 * @param {Object} api  The API object for the AJAX call.
 *
 * @return {Object} An object with the data or error from the AJAX call.
 */
const customBaseQuery = async (args, api) => {
	const state = api.getState();
	const followerId = state.currFollower.id;

	if (followerId) {
		args.headers = {
			...args.headers,
			'X-CCVTR-Follower-Id': followerId,
		};
	}

	// Catch errors and _return_ them so the RTKQ logic can track it.
	try {
		const data = await apiFetch(args).then((response) => {
			if (response.error) {
				throw new Error(response.error);
			}
			return response;
		});
		return { data };
	} catch (error) {
		return { error };
	}
};

// Define an API endpoint for fetching followers
export const localApi = createApi({
	baseQuery: customBaseQuery,
	tagTypes: ['Follow', 'Follower', 'Settings', 'Dashboard', 'AMPlugins'],
	endpoints: (builder) => ({
		/**
		 * A query function for fetching a list of follows.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path for the AJAX call.
		 */
		getFollows: builder.query({
			query: (args) => {
				const params = pick(args, [
					'page',
					'type',
					'date',
					'sortBy',
					'sortOrder',
					'search',
					'postId',
					'commentId',
					'followerId',
				]);

				// Clean null properties from object queryParams
				Object.keys(params).forEach((key) => {
					if (params[key] === null || params[key] === undefined) {
						delete params[key];
					}

					// Convert key to snake_case.
					if (key !== snakeCase(key)) {
						params[snakeCase(key)] = params[key];
						delete params[key];
					}
				});

				return {
					path: addQueryArgs(`v1/follows`, params),
				};
			},

			// Cache tags to autoamte re-fetching
			// See: https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
			providesTags: ['Follow'],
		}),

		/**
		 * A mutation function to perform an action on a list of follows.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path, method, and body for the AJAX call.
		 */
		updateFollows: builder.mutation({
			query: ({ action, ids, followerId }) => {
				const args = {
					path: `v1/follows/${action}`,
					method: 'POST',
					body: {
						ids,
					},
				};

				if (followerId) {
					args.headers = {
						'X-CCVTR-Follower-Id': followerId,
					};
				}

				return args;
			},

			// Cache tags to autoamte re-fetching
			// See: https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
			invalidatesTags: ['Follow'],
		}),

		/**
		 * A mutation function to delete a single follow record.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path, method, and body for the AJAX call.
		 */
		deleteFollows: builder.mutation({
			query: ({ id, followerId }) => {
				const args = {
					path: `v1/follows/${id}`,
					method: 'DELETE',
				};

				if (followerId) {
					args.headers = {
						'X-CCVTR-Follower-Id': followerId,
					};
				}

				return args;
			},

			// Cache tags to autoamte re-fetching
			// See: https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
			invalidatesTags: ['Follow'],
		}),

		/**
		 * A query function for fetching a single follower.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path for the AJAX call.
		 */
		getFollower: builder.query({
			query: (id) => {
				return {
					path: `v1/followers/${id}`,
				};
			},

			// Cache tags to autoamte re-fetching
			// See: https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
			providesTags: (result, error, arg) => [{ type: 'Follower', id: result?.id }],
		}),

		/**
		 * A mutation function to update a single follower record.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path, method, and body for the AJAX call.
		 */
		updateFollower: builder.mutation({
			query: (follower) => {
				return {
					path: `v1/followers/${follower.id}`,
					method: 'POST',
					body: {
						...follower,
					},
				};
			},

			// Cache tags to autoamte re-fetching
			// See: https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
			invalidatesTags: (result, error, arg) => [{ type: 'Follower', id: result?.updated?.id }],
		}),

		/**
		 * A query function for fetching the plugin settings.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path for the AJAX call.
		 */
		getSettings: builder.query({
			query: () => {
				return {
					path: `v1/settings`,
				};
			},

			// Cache tags to autoamte re-fetching
			// See: https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
			providesTags: ['Settings'],
		}),

		/**
		 * A mutation function to update the plugin settings.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path, method, and body for the AJAX call.
		 */
		updateSettings: builder.mutation({
			query: (settings) => {
				return {
					path: `v1/settings`,
					method: 'POST',
					body: {
						...settings,
					},
				};
			},

			// Cache tags to autoamte re-fetching
			// See: https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
			invalidatesTags: ['Settings'],
		}),

		/**
		 * A query function for fetching the AM plugins list.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path for the AJAX call.
		 */
		getAMPlugins: builder.query({
			query: () => {
				return {
					path: `v1/am-plugins`,
				};
			},

			// Cache tags to autoamte re-fetching
			// See: https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
			providesTags: ['AMPlugins'],
		}),

		/**
		 * A mutation function to perform actions on the AM plugins list.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path, method, and body for the AJAX call.
		 */
		updateAMPlugins: builder.mutation({
			query: (plugin) => {
				const payload = {
					id: plugin.id,
					actionNonce: plugin.actionNonce,
				};

				return {
					path: `v1/am-plugins`,
					method: 'POST',
					body: payload,
				};
			},

			async onQueryStarted(plugin, { dispatch, queryFulfilled }) {
				dispatch(
					localApi.util.updateQueryData('getAMPlugins', undefined, (draft) => {
						const index = draft.findIndex((p) => p.id === plugin.id);
						if (index !== -1) {
							// Update the plugin status to show the user that the action is in progress.
							// The `updating` flag will be reset once the AMPlugins cache gets invalidated and the list is re-fetched again.
							draft[index] = {
								...draft[index],
								updating: true,
							};
						}
					})
				);

				try {
					await queryFulfilled;
				} catch {}
			},

			// Cache tags to autoamte re-fetching
			// See: https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
			invalidatesTags: ['AMPlugins'],
		}),

		/**
		 * A mutation function to upload a file.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path, method, and body for the AJAX call.
		 */
		uploadFile: builder.mutation({
			query: ({ file, path }) => {
				const formData = new FormData();
				formData.append('file', file);
				formData.append('path', path);

				return {
					path: `v1/file`,
					method: 'POST',
					body: formData,
					useBody: true,
				};
			},
		}),

		/**
		 * A query function for fetching the dashboard.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path for the AJAX call.
		 */
		getDashboard: builder.query({
			query: () => {
				return {
					path: `v1/dashboard`,
				};
			},

			// Cache tags to autoamte re-fetching
			// See: https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
			providesTags: ['Dashboard'],
		}),

		/**
		 * A mutation function to update to send a test digest email.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path for the AJAX call.
		 */
		sendTestEmail: builder.mutation({
			query: (to) => {
				return {
					path: `v1/settings/send-test-email`,
					method: 'POST',
					body: {
						to,
					},
				};
			},
		}),
	}),
});

export const {
	useGetFollowsQuery,
	useUpdateFollowsMutation,
	useDeleteFollowsMutation,
	useGetFollowerQuery,
	useUpdateFollowerMutation,
	useGetSettingsQuery,
	useUpdateSettingsMutation,
	useUploadFileMutation,
	useGetDashboardQuery,
	useGetAMPluginsQuery,
	useUpdateAMPluginsMutation,
	useSendTestEmailMutation,
} = localApi;
