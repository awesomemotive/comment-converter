import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { WpListTable } from '../../Common/WordPress/ListTable/WpListTable';

import { useDeleteFollowsMutation, useGetFollowsQuery, useUpdateFollowsMutation } from '../../store/localApi';
import { useQueryParam } from '../../Lib/hooks/useQueryParam';
import { useNavigation } from '../../Pages/hooks/useNavigation';

import {
	allBulkActionOptions,
	singleOptInBulkActionOptions,
	dateFilterOptions,
	allFilterOptions,
	singleOptInFilterOptions,
} from './dropdownValues';
import { useConfirmationModal } from '../../Common/Modals/hooks/useConfirmationModal';
import { buildHeaderColumns, buildTableRow, columns } from './followColumns';
import { Loading } from '../../Common/Layout/Loading';
import { parseErrorResponse } from '../../utils/error';
import { Alert } from '../../Common/Alert/Alert';
import { TextLinkButton } from '../../Common/Buttons/BaseButton';

const defaultColumns = Object.values(columns);

export const FollowsTable = (props) => {
	const {
		followerId: defaultFollowerId,
		disableSearch = false,
		disableFilter = false,
		columns = defaultColumns,
		isDoubleOptInEnabled = false,
		...rest
	} = props;

	const [currPage, setCurrPage] = useQueryParam('paged', 1);
	const [searchTerm, setSearchTerm] = useQueryParam('s', '');
	const [typeFilter, setTypeFilter] = useQueryParam('type', '');
	const [dateFilter] = useQueryParam('date', '');
	const [sortBy] = useQueryParam('orderby', 'follower');
	const [sortOrder, setSortOrder] = useQueryParam('order', 'asc');
	const [followerId, setFollowerId] = useQueryParam('follower_id', defaultFollowerId);
	const [postId, setPostId] = useQueryParam('post_id');
	const [commentId, setCommentId] = useQueryParam('comment_id');

	const queryScopeParams = {
		commentId,
		followerId,
		postId,

		// Pagination
		page: currPage,

		// Sorting
		sortBy,
		sortOrder,

		// Searching
		search: searchTerm,

		// Filtering
		type: typeFilter,
		date: dateFilter,
	};

	if (disableSearch) {
		delete queryScopeParams.search;
	}

	if (disableFilter) {
		delete queryScopeParams.type;
	}

	const { data, error: fetchingError, isLoading, isFetching } = useGetFollowsQuery(queryScopeParams);

	const [updateFollows, updateFollowsResult] = useUpdateFollowsMutation();
	const [deleteFollow, deleteFollowResult] = useDeleteFollowsMutation();

	const { goToPage } = useNavigation();

	const [idToDelete, setIdToDelete] = useState(null);
	const [DeleteConfirmationModal, openDeleteConfirmationModal, closeDeleteConfirmationModal] = useConfirmationModal();

	/**
	 * Handles a change event on the sort select component.
	 *
	 * @since 0.9.1
	 *
	 * @param {string} newSortBy    The new sort by value.
	 * @param {string} newSortOrder The new sort order value.
	 *
	 * @return {void}
	 */
	const handleSortChange = (newSortBy, newSortOrder = 'asc') => {
		setSortOrder({
			order: newSortOrder,
			orderby: newSortBy,
		});
	};

	/**
	 * Handles resetting any scoped query parameters.
	 */
	const handleResetScopedQuery = () => {
		if (followerId) {
			setFollowerId(null);
		}

		if (postId) {
			setPostId(null);
		}

		if (commentId) {
			setCommentId(null);
		}
	};

	/**
	 * Handles a change event on the bulk action select component.
	 *
	 * @since 0.9.1
	 *
	 * @param {string} action The new bulk action.
	 * @param {Array}  ids    The IDs of the selected rows.
	 *
	 * @return {void}
	 */
	const onBulkActionChange = (action, ids) => {
		if (!action || !ids.length) {
			return;
		}

		if ('delete' === action || 'unsubscribe' === action) {
			setIdToDelete(ids);
			openDeleteConfirmationModal();
			return;
		}
		updateFollows({ action, ids, followerId: defaultFollowerId });
	};

	/**
	 * Handles a click event on a follower action button.
	 *
	 * @since 0.9.1
	 *
	 * @param {Object} action The action object for the clicked button.
	 * @param {Object} row    The row object for the clicked button.
	 *
	 * @return {void}
	 */
	const handleFollowerAction = (action, row) => {
		switch (action) {
			case 'view-follows':
			case 'edit':
				goToPage('follower', { id: row.follower.id });
				break;
			case 'send-email':
				const anchorTag = document.createElement('a');
				anchorTag.href = `mailto:${row.follower.notification_email}`;
				anchorTag.target = '_blank';
				anchorTag.rel = 'noopener noreferrer';
				anchorTag.click();
				break;
			case 'confirm':
				onBulkActionChange('confirm', [row.id]);
				break;
			case 'follow-all':
				onBulkActionChange('follow-all', [row.id]);
				break;
			case 'follow-replies':
				onBulkActionChange('follow-replies', [row.id]);
				break;
		}
	};

	/**
	 * Handles the click event on the delete button.
	 *
	 * @since 0.9.1
	 *
	 * @param {Event} e - The click event.
	 */
	const handleDeleteClick = (e) => {
		const followId = e.currentTarget.dataset.followId;
		setIdToDelete(followId);
		openDeleteConfirmationModal();
	};

	/**
	 * Handles the confirmation of the delete action.
	 *
	 * @since 0.9.1
	 */
	const handleDeleteConfirmation = () => {
		if (Array.isArray(idToDelete)) {
			updateFollows({ action: 'delete', ids: idToDelete, followerId: defaultFollowerId });
		} else {
			deleteFollow({ id: idToDelete, followerId: defaultFollowerId });
		}
		handleDeleteClose();
	};

	/**
	 * Handles the closing of the delete confirmation modal.
	 *
	 * @since 0.9.1
	 */
	const handleDeleteClose = () => {
		closeDeleteConfirmationModal();
		setIdToDelete(null);
	};

	// Only shows the follows if there is no error. In case of error, the `data` can still contain data from the
	// last successful request, which could be misleading.
	const follows = !fetchingError && data?.data ? data.data : [];

	if (isLoading) {
		return <Loading />;
	}

	const error = fetchingError || updateFollowsResult.error || deleteFollowResult.error;

	// If the error happens on initial load, shows only the error message.
	if (error && !data) {
		return <Alert type="error">{parseErrorResponse(error)}</Alert>;
	}

	const { total, total_pages: totalPages, size: pageSize } = data;

	let scopedBy;
	const isScopedQuery = postId || (followerId && !defaultFollowerId) || commentId;

	if (isScopedQuery) {
		if (followerId) {
			const followerName = follows.length ? follows[0].follower.name : followerId;

			// translators: %d: The name or ID of the follower
			scopedBy = sprintf(
				__('Follower "%s"', 'subscribe-to-comment-notifications-comment-converter'),
				followerName
			);
		}

		if (postId) {
			const postTitle = follows.length ? follows[0].post.post_title : postId;

			// translators: %s: The title or ID of the post
			scopedBy = sprintf(__('Post "%s"', 'subscribe-to-comment-notifications-comment-converter'), postTitle);
		}

		if (commentId) {
			// translators: %s: The ID of the comment
			scopedBy = sprintf(__('Comment "%s"', 'subscribe-to-comment-notifications-comment-converter'), commentId);
		}

		// translators: %s: the string representing the parameter
		scopedBy = sprintf(__('View Follows for %s', 'subscribe-to-comment-notifications-comment-converter'), scopedBy);
	}

	return (
		<>
			{error ? (
				<Alert className="mb-4" type="error">
					{parseErrorResponse(error)}
				</Alert>
			) : null}
			{isScopedQuery ? (
				<div className="flex items-center mb-4">
					<span className="text-primaryText font-bold text-[28px] mr-2.5 rtl:!mr-0 rtl:ml-2.5">
						{scopedBy}
					</span>
					<TextLinkButton size="small" onClick={handleResetScopedQuery}>
						{__('View All', 'subscribe-to-comment-notifications-comment-converter')}
					</TextLinkButton>
				</div>
			) : null}
			<WpListTable
				columns={buildHeaderColumns(columns)}
				isLoading={isFetching || updateFollowsResult.isLoading || deleteFollowResult.isLoading}
				rows={follows.map((follow) =>
					buildTableRow(follow, columns, {
						onFollowerAction: handleFollowerAction,
						onDeleteClick: handleDeleteClick,
						isDoubleOptInEnabled,
					})
				)}
				bulkActionControl={{
					options: isDoubleOptInEnabled ? allBulkActionOptions : singleOptInBulkActionOptions,
					onApply: onBulkActionChange,
				}}
				dateFilterControl={{
					options: dateFilterOptions,
					value: dateFilter,
				}}
				filterControl={{
					hide: disableFilter,
					options: isDoubleOptInEnabled ? allFilterOptions : singleOptInFilterOptions,
					value: typeFilter,
					onApply: setTypeFilter,
				}}
				paginationControl={{
					current: currPage,
					total: totalPages,
					size: pageSize,
					onApply: setCurrPage,
				}}
				searchControl={{
					hide: disableSearch,
					value: searchTerm,
					onApply: setSearchTerm,
				}}
				sortControl={{
					sortedBy: sortBy,
					sortedOrder: sortOrder,
					onApply: handleSortChange,
				}}
				totalItems={total}
				{...rest}
			/>
			<DeleteConfirmationModal
				title={__('Delete', 'subscribe-to-comment-notifications-comment-converter')}
				message={__(
					'This action will remove the follow(s), associated notifications, and all records.',
					'subscribe-to-comment-notifications-comment-converter'
				)}
				onConfirmClick={handleDeleteConfirmation}
				onCancelClick={handleDeleteClose}
				onRequestClose={handleDeleteClose}
				width={520}
			/>
		</>
	);
};
