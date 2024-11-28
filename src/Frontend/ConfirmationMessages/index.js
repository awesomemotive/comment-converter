import { apiFetch } from '../../utils/apiFetch';
import './style.scss';
import { __ } from '@wordpress/i18n';

(function () {
	const confirmationMessages = {
		/**
		 * Initializes the follow confirmation messages.
		 *
		 * @since 0.9.1
		 */
		init() {
			const { commentId, confirmationMessage, promptMessage, promptToFollowAgain, nonce } = window.ccData;

			if (!commentId || !confirmationMessage) {
				return;
			}

			this.commentId = commentId;
			this.confirmationMessage = confirmationMessage;
			this.promptMessage = promptMessage;
			this.actionNonce = nonce;

			if (promptToFollowAgain) {
				return this.promptToFollowCommentAgain();
			}

			this.displaySuccessAlert(confirmationMessage);
		},

		/**
		 * Prompts the user to follow the comment again.
		 *
		 * This is used after the user has just opted out of following a comment. This works to confirm if that's really what they want.
		 *
		 * @since 0.9.1
		 */
		promptToFollowCommentAgain() {
			const alert = document.createElement('div');
			alert.classList.add('ccvtr-alert', 'ccvtr-alert-prompt');
			alert.innerHTML = `
				<div>
					${this.promptMessage}
				</div>
				<div class="ccvtr-buttons">
					<button id="yesBtn" class="ccvtr-primary-btn">
						${__('Yes', 'comment-notifications')}
					</button>
					<button id="noBtn" class="ccvtr-secondary-btn">
						${__('No', 'comment-notifications')}
					</button>
				</div>
			`;

			const yesButton = alert.querySelector('#yesBtn');
			const noButton = alert.querySelector('#noBtn');

			yesButton.addEventListener('click', this.handleCreateFollow.bind(this));
			noButton.addEventListener('click', this.handleClose.bind(this));

			this.writeToPage(alert);
		},

		/**
		 * Handles displaying a success alert.
		 *
		 * @since 0.9.1
		 *
		 * @param {string} message The message to display in the alert.
		 */
		displaySuccessAlert(message) {
			this.displayAlert(message, 'success');
		},

		/**
		 * Handles displaying an error alert.
		 *
		 * @since 0.9.1
		 *
		 * @param {string} message The message to display in the alert.
		 */
		displayErrorAlert(message) {
			this.displayAlert(message, 'error');
		},

		/**
		 * Handles displaying an alert.
		 *
		 * @since 0.9.1
		 *
		 * @param {string} message The message to display in the alert.
		 * @param {string} type    The type of alert to display.
		 */
		displayAlert(message, type) {
			const alert = document.createElement('div');
			alert.classList.add('ccvtr-alert', `ccvtr-alert-${type}`);
			alert.innerHTML = message;

			this.writeToPage(alert);
		},

		/**
		 * Handles the creating the follow for the comment.
		 *
		 * @since 0.9.1
		 */
		async handleCreateFollow() {
			try {
				await apiFetch({
					path: `v1/comment-follows`,
					method: 'POST',
					body: {
						comment_id: this.commentId,
						nonce: this.actionNonce,
					},
				}).then((response) => {
					if (response.error) {
						throw new Error(response.error);
					}
					return response;
				});

				this.displaySuccessAlert(this.confirmationMessage);
			} catch (error) {
				this.displayErrorAlert(error.message);
			}
		},

		/**
		 * Handles the closing of the alert.
		 *
		 * @since 0.9.1
		 */
		handleClose() {
			this.outputEl.remove();
		},

		/**
		 * Outputs element to the page below the comment content.
		 *
		 * @since 0.9.1
		 *
		 * @param {HTMLElement} elementToOutput The element to output to the page.
		 */
		writeToPage(elementToOutput) {
			if (!this.commentContentEl) {
				this.commentContentEl = document.querySelector(
					`#comment-${this.commentId} .comment-content, #comment-${this.commentId} .wp-block-comment-content`
				);
			}

			if (!this.commentContentEl) {
				// Bail if the comment content element doesn't exist.
				return;
			}

			if (!this.outputEl) {
				this.outputEl = document.createElement('div');
				this.outputEl.classList.add('ccvtr-output');
				this.outputEl.appendChild(elementToOutput);
				this.commentContentEl.appendChild(this.outputEl);
				return;
			}

			this.outputEl.replaceChild(elementToOutput, this.outputEl.firstChild);
		},
	};

	confirmationMessages.init();
})();
