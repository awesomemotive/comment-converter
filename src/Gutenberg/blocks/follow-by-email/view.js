import { __ } from '@wordpress/i18n';
import './style.scss';
import { apiFetch } from '../../../utils/apiFetch';
import { parseErrorResponse } from '../../../utils/error';
import { decodeHtml } from '../../../utils/html';

const Modal = {
	modal: null,
	init() {
		if (this.modal) {
			return;
		}

		this.appendElementsToDom();
		this.bindEvents();
	},

	/**
	 * Appends the modal elements to the DOM.
	 *
	 * @since 0.9.1
	 */
	appendElementsToDom() {
		const modal = document.getElementById('ccvtr-modal');

		if (modal) {
			return;
		}

		// Create modal HTML dynamically
		const modalContainer = document.createElement('div');
		modalContainer.id = 'ccvtr-modal';
		modalContainer.classList.add('ccvtr-modal-overlay');
		modalContainer.innerHTML = `
			<div class="ccvtr-modal-content">
				<div class="ccvtr-modal-content-body">
					<h4 class="ccvtr-modal-title">
						<!-- Title will be set dynamically -->
					</h4>
					<p>
						${__(
							'Share your email address below and we’ll let you know anytime new comments or replies are posted.',
							'comment-notifications'
						)}
					</p>
					<form id="ccvtr-modal-form" class="ccvtr-modal-form">
						<div class="ccvtr-input-wrapper">
							<label for="ccvtr-modal-name">${__('Your Name', 'comment-notifications')}:</label>
							<input type="text" name="name" id="ccvtr-modal-name" required />
							<div class="ccvtr-error-message">
								${__('The name field is required.', 'comment-notifications')}
							</div>
						</div>
						<div class="ccvtr-input-wrapper">
							<label for="ccvtr-modal-email">${__('Your Email Address', 'comment-notifications')}:</label>
							<input type="email" name="email" id="ccvtr-modal-email" required />
							<div class="ccvtr-error-message">
								${__('A valid email is required.', 'comment-notifications')}
							</div>
						</div>
					</form>
				</div>
				<div class="ccvtr-modal-action-buttons">
					<button id="save-button">${__('Save', 'comment-notifications')}</button>
					<button id="cancel-button">${__('Cancel', 'comment-notifications')}</button>
				</div>
				<div class="ccvtr-modal-error-message"></div>
			</div>
		`;

		this.modal = document.body.appendChild(modalContainer);
		this.modalError = this.modal.querySelector('.ccvtr-modal-error-message');

		this.saveButton = this.modal.querySelector('#save-button');
		this.cancelButton = this.modal.querySelector('#cancel-button');

		this.form = this.modal.querySelector('#ccvtr-modal-form');
		this.formFields = {
			name: this.form.querySelector('#ccvtr-modal-name'),
			email: this.form.querySelector('#ccvtr-modal-email'),
			//subscribe: this.form.querySelector('#ccvtr-modal-subscribe'),
		};
	},

	/**
	 * Opens the modal.
	 *
	 * @since 0.9.1
	 */
	openModal() {
		this.modal.style.display = 'flex';
	},

	/**
	 * Closes the modal.
	 *
	 * @since 0.9.1
	 */
	closeModal() {
		this.modal.style.display = 'none';
	},

	/**
	 * Resets the form with the given user email and name.
	 *
	 * @since 0.9.1
	 *
	 * @param {string} userEmail The user's email.
	 * @param {string} userName  The user's name.
	 */
	resetForm(userEmail, userName) {
		this.form.reset();

		const inputWrappers = this.form.querySelectorAll('.ccvtr-input-wrapper');
		inputWrappers.forEach((wrapper) => wrapper.classList.remove('ccvtr-invalid-input'));

		this.modalError.innerHTML = '';

		if (userEmail) {
			this.formFields.email.value = userEmail;
		}

		if (userName) {
			this.formFields.name.value = userName;
		}
	},

	/**
	 * Binds the events to the modal buttons.
	 *
	 * @since 0.9.1
	 */
	bindEvents() {
		this.saveButton.addEventListener('click', this.handleSave.bind(this));
		this.cancelButton.addEventListener('click', this.closeModal.bind(this));
	},

	/**
	 * Handles the save event of the modal.
	 *
	 * @since 0.9.1
	 */
	async handleSave() {
		// Validate the name and email field.
		this.checkForError(this.formFields.name);
		this.checkForError(this.formFields.email);

		if (this.form.checkValidity()) {
			try {
				// Reset error before making the request.
				this.modalError.innerHTML = '';
				this.saveButton.disabled = true;

				await apiFetch({
					path: `v1/follows`,
					method: 'POST',
					body: {
						name: this.formFields.name.value,
						email: this.formFields.email.value,
						//subscribe: this.formFields.subscribe.checked,
						post_id: this.form.dataset.postId,
						nonce: this.form.dataset.nonce,
					},
				});
			} catch (error) {
				this.saveButton.disabled = false;
				this.modalError.innerHTML = parseErrorResponse(error);
				return;
			}

			this.closeModal();
		}
	},

	/**
	 * Checks for errors in the given input element.
	 *
	 * @since 0.9.1
	 *
	 * @param {HTMLElement} inputElement The input element to check.
	 */
	checkForError(inputElement) {
		const inputWrapper = inputElement.closest('.ccvtr-input-wrapper');

		if (!inputElement.checkValidity()) {
			// Display error message and style.
			inputWrapper.classList.add('ccvtr-invalid-input');
		} else {
			// Remove error message and style.
			inputWrapper.classList.remove('ccvtr-invalid-input');
		}
	},

	/**
	 * Displays the modal for a given post ID, title, user email, and name.
	 *
	 * @since 0.9.1
	 *
	 * @param {string} postId    The post ID.
	 * @param {string} postTitle The post title.
	 * @param {string} userEmail The user's email.
	 * @param {string} userName  The user's name.
	 * @param {string} nonce     The action nonce.
	 */
	display(postId, postTitle, userEmail, userName, nonce) {
		this.init();

		const modalTitle = this.modal.querySelector('.ccvtr-modal-title');

		// translators: {TITLE} will be replaced with the post title.
		modalTitle.innerHTML = __('Follow Comments and Replies to ‘{TITLE}’', 'comment-notifications').replace(
			'{TITLE}',
			decodeHtml(postTitle)
		);

		this.form.dataset.postId = postId;
		this.form.dataset.nonce = nonce;

		// TODO: if user is logged in, check if they are already subscribed to this post.
		// If so, don't show the subscribe option again.

		// Reset the form and pre-fill the email and name fields if available.
		this.resetForm(userEmail, userName);

		this.openModal();
	},
};

/**
 * Handles the click event in the Follow By Email block link.
 *
 * @since 0.9.1
 *
 * @param {Event} event The event object.
 */
const handleFollowClick = (event) => {
	const { postId, postTitle, userEmail, userName, nonce } = event.target.closest(
		'.wp-block-comment-converter-follow-by-email'
	).dataset;

	// Prevent the default action if missing required data.
	// This will happend when the block is rendered as a simple link to Follower Dashboard.
	if (!postId || !nonce) {
		return;
	}

	event.preventDefault();
	event.stopPropagation();

	Modal.display(postId, postTitle, userEmail, userName, nonce);
};

/**
 * Setup the click handler for the Follow By Email block.
 *
 * @since 0.9.1
 */
const setupClickHandlers = () => {
	document
		.querySelectorAll('.wp-block-comment-converter-follow-by-email')
		.forEach((element) => element.addEventListener('click', handleFollowClick));
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', setupClickHandlers);
} else {
	setupClickHandlers();
}
