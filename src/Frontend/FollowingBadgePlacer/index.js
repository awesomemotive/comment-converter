import './style.scss';

(function () {
	const followingBadgePlacer = {
		/**
		 * Initializes the badge placer.
		 *
		 * @since 0.9.1
		 */
		init() {
			this.placeFollowingBadge();
		},

		/**
		 * Places the following badges depending on the data passed from the back-end.
		 *
		 * @since 0.9.1
		 */
		placeFollowingBadge() {
			if (window.ccData.commentIds) {
				this.placeCommentFollowingBadges(window.ccData.commentIds, window.ccData.followingBadgeOutput);
			}

			if (window.ccData.postId) {
				this.placePostFollowingBadge(window.ccData.followingBadgeOutput);
			}
		},

		/**
		 * Places the following badge for a post follow.
		 *
		 * @since 0.9.1
		 *
		 * @param {string} followingBadgeOutput The HTML string of the following badge.
		 */
		placePostFollowingBadge(followingBadgeOutput) {
			// Looks for direct headings withing comment related class with the intent of finding the comment section title.
			const commentTitleSelectors = [
				'*[class*="comments"] > h1',
				'*[class*="comments"] > h2',
				'*[class*="comments"] > h3',
			];

			const commentTitleEls = Array.from(document.querySelectorAll(commentTitleSelectors.join(', ')));

			// Check if any of the potential titles doesn't have the badge already.
			const hasBadgeAlready = commentTitleEls.filter((commentTitleEl) => {
				return !!commentTitleEl.querySelector('.ccvtr-following-badge');
			});

			if (hasBadgeAlready.length) {
				return;
			}

			this.maybeInsertBadge(commentTitleEls[0], followingBadgeOutput);
		},

		/**
		 * Places the following badges for comment follows.
		 *
		 * @since 0.9.1
		 *
		 * @param {Array}  commentIds           The IDs of the comments.
		 * @param {string} followingBadgeOutput The HTML string of the following badge.
		 */
		placeCommentFollowingBadges(commentIds, followingBadgeOutput) {
			commentIds.forEach(function (commentId) {
				const commentAuthorEl = document.querySelector(`#comment-${commentId} .comment-author.vcard`);

				if (!commentAuthorEl) {
					return;
				}

				this.maybeInsertBadge(commentAuthorEl, followingBadgeOutput);
			}, this);
		},

		/**
		 * Inserts the following badge into an element (but only if it doesn't exist already).
		 *
		 * @since 0.9.1
		 *
		 * @param {HTMLElement} elToInsert           The element to insert the badge into.
		 * @param {string}      followingBadgeOutput The HTML string of the following badge.
		 */
		maybeInsertBadge(elToInsert, followingBadgeOutput) {
			let followingBadge = elToInsert.querySelector('.ccvtr-following-badge');

			if (!followingBadge) {
				elToInsert.insertAdjacentHTML('beforeend', followingBadgeOutput);

				followingBadge = elToInsert.querySelector('.ccvtr-following-badge');
				followingBadge.classList.add('added-by-placer');
			}
		},
	};

	followingBadgePlacer.init();
})();
