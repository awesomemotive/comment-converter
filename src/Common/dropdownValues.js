import { __ } from '@wordpress/i18n';
const { dropdownValues } = window.ccData;

import { ReactComponent as RoundedSquare } from '../../assets/badge-icons/rounded-square-logo.svg';
import { ReactComponent as WhiteLogo } from '../../assets/badge-icons/white-logo.svg';
import { ReactComponent as ColoredLogo } from '../../assets/badge-icons/colored-logo.svg';
import { ReactComponent as PersonCheck } from '../../assets/badge-icons/person-check.svg';
import { ReactComponent as PersonPlus } from '../../assets/badge-icons/person-plus.svg';

export const notificationFrequencyOptions = [
	{ value: 'immediately', label: __('Immediately', 'comment-notifications') },
	{ value: 'daily', label: __('Daily', 'comment-notifications') },
	{ value: 'weekly', label: __('Weekly', 'comment-notifications') },
];

export const FOLLOW_TYPE_COMMENT_REPLIES = 'replies';
export const FOLLOW_TYPE_ALL_COMMENTS = 'all';
export const FOLLOW_TYPE_NO_FOLLOW = 'no';

export const followTypeOptions = [
	{ value: FOLLOW_TYPE_ALL_COMMENTS, label: __('Follow All Comments', 'comment-notifications') },
	{ value: FOLLOW_TYPE_COMMENT_REPLIES, label: __('Follow Replies Only', 'comment-notifications') },
	{ value: FOLLOW_TYPE_NO_FOLLOW, label: __('Do Not Follow', 'comment-notifications') },
];

export const getPostTypeOptions = () => dropdownValues.post_types;

const defaultFollowingBadges = [
	{
		slug: 'rounded-square-logo',
		Icon: RoundedSquare,
	},
	{
		slug: 'white-logo',
		Icon: WhiteLogo,
	},
	{
		slug: 'colored-logo',
		Icon: ColoredLogo,
	},
	{
		slug: 'person-check',
		Icon: PersonCheck,
	},
	{
		slug: 'person-plus',
		Icon: PersonPlus,
	},
];

/**
 * Builds the options for the following badge dropdown.
 *
 * @since 0.9.1
 *
 * @param {string} color The color to use for the icons.
 *
 * @return {Array} An array of objects, each with a `value` and `label` property.
 */
export const buildFollowingBadgeOptions = (color) =>
	defaultFollowingBadges.map(({ slug, Icon }) => {
		return {
			value: slug,
			label: <Icon color={color} />,
		};
	});
