import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { Button, CheckboxControl, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { store as postSettingsStore } from './store';
import * as urls from '../../../utils/urls';
import { Badge } from './Badge';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../../../theme';

const BadgeWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 15px 0;
`;

const StyledNotice = styled(Notice)`
	margin: 20px 0 0;

	.components-notice__action.components-button.is-link {
		margin-left: 0;
	}
`;

registerPlugin('comment-converter-post-settings', {
	/**
	 * Renders the Comment Converter post settings panel.
	 *
	 * @since 0.9.1
	 *
	 * @return {JSX.Element} The rendered post settings panel.
	 */
	render() {
		/**
		 * The current post ID.
		 *
		 * @type {number}
		 */
		const currentPostId = useSelect((select) => {
			return select(editorStore).getCurrentPostId();
		}, []);

		/**
		 * The comment counts for the current post.
		 *
		 * @type {Object}
		 * @property {number} followers   The number of followers of the current post.
		 * @property {number} subscribers The number of subscribers of the current post.
		 */
		const { counts, isEmailRequired } = useSelect((select) => {
			return select(postSettingsStore).getCounts(currentPostId);
		}, []);

		/**
		 * The post meta data for the current post.
		 *
		 * @type {Object}
		 */
		const meta = useSelect((select) => {
			return select(editorStore).getEditedPostAttribute('meta') || {};
		}, []);

		/**
		 * The editPost function from the editor store.
		 *
		 * @type {Function}
		 */
		const { editPost } = useDispatch(editorStore);

		/**
		 * Edits the post meta data for the current post.
		 *
		 * @param {string} key   The key of the meta data to edit.
		 * @param {*}      value The new value for the meta data.
		 */
		const editPostMeta = (key, value) => {
			editPost({
				meta: {
					[key]: value,
				},
			});
		};

		/**
		 * Toggles the comment following setting for the current post.
		 */
		const toggleCommentFollowing = () => {
			editPostMeta('ccvtr_enable_comment_following', !meta.ccvtr_enable_comment_following);
		};

		/**
		 * Toggles the comment subscribing setting for the current post.
		 */
		const toggleCommentSubscribing = () => {
			editPostMeta('ccvtr_enable_comment_subscribing', !meta.ccvtr_enable_comment_subscribing);
		};

		const reviewDiscussionSettingsAction = {
			label: __('Review settings', 'subscribe-to-comment-notifications-comment-converter'),
			url: urls.discussionSettings,
			variant: 'link',
		};

		return (
			<PluginDocumentSettingPanel name="comment-converter-panel" title="Comment Converter">
				<ThemeProvider theme={theme}>
					<CheckboxControl
						label={__('Allow comment following', 'subscribe-to-comment-notifications-comment-converter')}
						checked={!!meta.ccvtr_enable_comment_following}
						onChange={toggleCommentFollowing}
					/>
					{/* TODO: the checkbox below should be disabled and up-selled when not PRO */}
					{/* <Tooltip text={__('This feature requires a PRO subscription.', 'subscribe-to-comment-notifications-comment-converter')}>
						<div>
							<CheckboxControl
								checked={!!meta.ccvtr_enable_comment_subscribing}
								label={__('Allow subscription to email list', 'subscribe-to-comment-notifications-comment-converter')}
								onChange={toggleCommentSubscribing}
							/>
						</div>
					</Tooltip> */}
					<BadgeWrapper>
						{__('Total followers from this post', 'subscribe-to-comment-notifications-comment-converter')}
						{counts && null !== counts.followers ? <Badge>{counts.followers}</Badge> : <em>...</em>}
					</BadgeWrapper>
					{/* <BadgeWrapper>
						{__('Total subscribers from this post', 'subscribe-to-comment-notifications-comment-converter')}
						{counts && null !== counts.subscribers ? <Badge>{counts.subscribers}</Badge> : <em>...</em>}
					</BadgeWrapper> */}
					<Button
						href={addQueryArgs(urls.followers, { post_id: currentPostId })}
						target="_blank"
						rel="noopener noreferrer"
						isLink
					>
						{__('View Followers', 'subscribe-to-comment-notifications-comment-converter')}
					</Button>
					{null !== isEmailRequired && !isEmailRequired ? (
						<StyledNotice status="warning" isDismissible={false} actions={[reviewDiscussionSettingsAction]}>
							<p
								dangerouslySetInnerHTML={{
									// translators: Comment Converter is the name of the plugin.
									__html: __(
										'Currently your <strong>WordPress discussion settings</strong> do not require an email when commenting. We recommend changing this so that Comment Converter can perform correctly. ',
										'subscribe-to-comment-notifications-comment-converter'
									),
								}}
							/>
						</StyledNotice>
					) : null}
				</ThemeProvider>
			</PluginDocumentSettingPanel>
		);
	},

	/**
	 * The icon for the Comment Converter post settings plugin.
	 *
	 * @since 0.9.1
	 *
	 * @type {string|boolean}
	 */
	icon: false,
});
