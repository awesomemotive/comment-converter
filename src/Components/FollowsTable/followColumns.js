import { __ } from '@wordpress/i18n';
import { UserCell } from '../../Common/WordPress/ListTable/UserCell';
import { IconButton, TextLinkButton } from '../../Common/Buttons/BaseButton';
import { IconTrash } from '../../Common/Icons';
import { followerActions } from './dropdownValues';
import { FollowTypeSelectInput } from './FollowTypeSelectInput';

export const columns = {
	FOLLOWER: 'follower',
	FOLLOWED_FROM: 'followed_from',
	COMMENT: 'comment',
	FOLLOW_TYPE: 'follow_type',
	CREATED: 'created',
	HAS_SUBSCRIBED: 'has_subscribed',
	ACTION: 'action',
};

const columnDefinitions = {
	[columns.FOLLOWER]: {
		slug: columns.FOLLOWER,
		label: __('Follower', 'subscribe-to-comment-notifications-comment-converter'),
		sortable: true,
		classes: 'w-[400px]',
	},
	[columns.FOLLOWED_FROM]: __('Followed From', 'subscribe-to-comment-notifications-comment-converter'),
	[columns.COMMENT]: __('Comment', 'subscribe-to-comment-notifications-comment-converter'),
	[columns.FOLLOW_TYPE]: {
		slug: columns.FOLLOW_TYPE,
		label: __('Follow Type', 'subscribe-to-comment-notifications-comment-converter'),
		sortable: true,
		classes: 'w-[230px]',
	},
	[columns.CREATED]: {
		slug: columns.CREATED,
		label: __('Followed On', 'subscribe-to-comment-notifications-comment-converter'),
		sortable: true,
		classes: 'w-[200px]',
	},
	[columns.HAS_SUBSCRIBED]: {
		slug: columns.HAS_SUBSCRIBED,
		label: __('Subscriber', 'subscribe-to-comment-notifications-comment-converter'),
		sortable: true,
		classes: 'w-[100px]',
	},
	[columns.ACTION]: {
		slug: columns.ACTION,
		label: __('Action', 'subscribe-to-comment-notifications-comment-converter'),
		classes: 'w-[60px]',
	},
};

/**
 * Maps the provided columns to their definitions.
 *
 * @since 0.9.1
 *
 * @param {Array} columns - The columns to map.
 *
 * @return {Array} The mapped column definitions.
 */
export function buildHeaderColumns(columns) {
	return columns.map((column) => {
		return columnDefinitions[column];
	});
}

/**
 * Builds the data for a table row based on the provided follow data, column slugs, and handlers.
 *
 * @since 0.9.1
 *
 * @param {Object} follow      - The follow data.
 * @param {Array}  columnSlugs - The slugs of the columns to include in the row.
 * @param {Object} handlers    - The handlers for the row actions.
 *
 * @return {Array} The data for the table row.
 */
export function buildTableRowData(follow, columnSlugs, handlers) {
	const {
		follower,
		post,
		comment = {},
		created,
		created_formatted: createdFormatted,
		confirmed,
		confirmed_formatted: confirmedFormatted,
		has_subscribed: hasSubscribed,
	} = follow;

	const { onFollowerAction, onDeleteClick, isDoubleOptInEnabled } = handlers;

	/**
	 * Handles the click event for the confirm button.
	 */
	const handleConfirmClick = () => {
		onFollowerAction('confirm', follow);
	};

	/**
	 * Handles the unsubscribe event for the follow type select.
	 *
	 * @param {number} followId The ID of the follow to unsubscribe.
	 */
	const handleUnsubscribe = (followId) => {
		onDeleteClick({ currentTarget: { dataset: { followId } } });
	};

	return columnSlugs.map((column) => {
		switch (column) {
			case columns.FOLLOWER:
				return (
					<UserCell
						key={`user-${follow.id}`}
						actions={followerActions}
						avatarSrc={follower.avatar}
						email={follower.notification_email}
						name={follower.name}
						onActionClick={onFollowerAction}
						row={follow}
					/>
				);
			case columns.FOLLOWED_FROM:
				return (
					<TextLinkButton
						as="a"
						key={`post-${follow.id}`}
						href={post.link}
						target="_blank"
						rel="noopener noreferrer"
						size="small"
					>
						{post.post_title}
					</TextLinkButton>
				);
			case columns.COMMENT:
				return (
					<div key={`comment-${follow.id}`}>
						<p
							className="text-xs leading-4 text-primaryText200 mb-2.5"
							data-comment-id={comment.comment_ID}
						>
							&quot;{comment.comment_content}&quot;
						</p>
						<TextLinkButton
							as="a"
							href={comment.link}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
						>
							{__('View Comment', 'subscribe-to-comment-notifications-comment-converter')}
						</TextLinkButton>
					</div>
				);
			case columns.FOLLOW_TYPE:
				return (
					<div key={`follow-type-${follow.id}`}>
						<FollowTypeSelectInput
							className="w-[190px]"
							commentId={follow.comment_id}
							label={__('Follow Type', 'subscribe-to-comment-notifications-comment-converter')}
							labelHidden={true}
							id={follow.id}
							name="type"
							onUnsubscribe={handleUnsubscribe}
							size="small"
							value={follow.type}
						/>
					</div>
				);
			case columns.CREATED:
				if (!isDoubleOptInEnabled) {
					return (
						<span
							className="text-xs text-primaryText200"
							key={`created-${follow.id}`}
							title={__('Created at this date.', 'subscribe-to-comment-notifications-comment-converter')}
						>
							{createdFormatted || created}
						</span>
					);
				}

				return (
					<span className="text-xs text-primaryText200" key={`created-${follow.id}`}>
						{!follow.confirmed ? (
							<>
								<span
									title={__(
										'Created at this date.',
										'subscribe-to-comment-notifications-comment-converter'
									)}
								>
									{createdFormatted || created}
								</span>

								<TextLinkButton size="small" onClick={handleConfirmClick}>
									{__('Confirm', 'subscribe-to-comment-notifications-comment-converter')}
								</TextLinkButton>
							</>
						) : (
							<span
								title={__(
									'Confirmed at this date.',
									'subscribe-to-comment-notifications-comment-converter'
								)}
							>
								{confirmedFormatted || confirmed}
							</span>
						)}
					</span>
				);
			case columns.HAS_SUBSCRIBED:
				return (
					<span className="text-xs text-primaryBlue" key={`subscribed-${follow.id}`}>
						{hasSubscribed
							? __('Yes', 'subscribe-to-comment-notifications-comment-converter')
							: __('No', 'subscribe-to-comment-notifications-comment-converter')}
					</span>
				);
			case columns.ACTION:
				return (
					<div key={`action-${follow.id}`}>
						<IconButton data-follow-id={follow.id} onClick={onDeleteClick}>
							<IconTrash />
						</IconButton>
					</div>
				);
		}

		return null;
	});
}

/**
 * Builds a table row based on the provided follow data, column slugs, and handlers.
 *
 * @since 0.9.1
 *
 * @param {Object} follow      - The follow data.
 * @param {Array}  columnSlugs - The slugs of the columns to include in the row.
 * @param {Object} handlers    - The handlers for the row actions.
 *
 * @return {Object} The table row.
 */
export function buildTableRow(follow, columnSlugs, handlers) {
	return {
		id: follow.id,
		data: buildTableRowData(follow, columnSlugs, handlers),
		redHighlight: !follow.confirmed,
	};
}
