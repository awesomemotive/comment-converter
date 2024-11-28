import formatDistance from 'date-fns/formatDistance';
import { decodeHtml } from './html';

/**
 * Formats an announcement object for display.
 *
 * @since 0.9.1
 *
 * @param {Object} announcement - The announcement object to format.
 *
 * @return {Object} The formatted announcement object.
 */
export const formatAnnouncement = (announcement) => {
	return {
		...announcement,
		date: formatDistance(new Date(announcement.date.split('T')[0]), new Date(), { addSuffix: true }),
		title: decodeHtml(announcement.title.rendered).replace('[Announcement] ', ''),
		excerpt: decodeHtml(announcement.excerpt.rendered)
			// We want to remove the paragraph tag at the beginning for more consistent styling
			.replaceAll('<p>', '')
			// We want to remove the paragraph tag at the end for more consistent styling
			.replaceAll('</p>', '')
			// We want to trim off the link section at the end since we are adding buttons
			.split('<a')[0]
			// There is already an ellipse object ('…') on each but sometimes there is a duplicate so let's remove that
			.replace('...', ''),
	};
};
