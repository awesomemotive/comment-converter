import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { marketing } from '../utils/urls';

// Define an API endpoint related to marketing site
export const marketingApi = createApi({
	reducerPath: 'marketingApi', // Unique reducerPath for this API slice
	baseQuery: fetchBaseQuery({ baseUrl: marketing() }),
	tagTypes: ['Announcements'],
	endpoints: (builder) => ({
		/**
		 * A query function for fetching the announcements from cc marketing site.
		 *
		 * @param {Object} args The arguments for the AJAX call.
		 *
		 * @return {Object} An object with the path for the AJAX call.
		 */
		getAnnouncements: builder.query({
			query: () => {
				return {
					// Post category ID of 'Announcements' is 11 in the marketing site.
					url: 'wp-json/wp/v2/posts?_fields=id,date,excerpt,title,link&categories=11&per_page=3&orderby=date',
				};
			},

			// Cache tags to autoamte re-fetching
			// See: https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
			providesTags: ['Announcements'],
		}),
	}),
});

export const { useGetAnnouncementsQuery } = marketingApi;
