import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { SecondaryButton } from '../Buttons/BaseButton';
import { WhiteBox } from '../Layout/WhiteBox';
import { HelpTip } from '../Tooltip/HelpTip';
import { createPortal } from 'react-dom';
import { assets } from '../../utils/urls';

export function EmailPreview(props) {
	const { content, subject, title, titleHelp, onClose } = props;

	const parsedSubject = subject.replace(
		/\[Post_Title\]/gi,
		__('Post Title Here', 'subscribe-to-comment-notifications-comment-converter')
	);

	const parsedContent = content
		.replace(/\[Post_Title\]/gi, __('Post Title Here', 'subscribe-to-comment-notifications-comment-converter'))
		.replace(
			/\[Comment_Content\]/gi,
			__(
				'This is an example comment that would appear inside the email for the follower to read and decide to take action on.',
				'subscribe-to-comment-notifications-comment-converter'
			)
		)
		.replace(
			/\[Comment_Author\]/gi,
			__("Comment Author's name", 'subscribe-to-comment-notifications-comment-converter')
		);

	const [contentRef, setContentRef] = useState(null);
	const mountNode = contentRef?.contentWindow?.document?.body;

	/**
	 * Resizes the iframe to fit its content.
	 *
	 * @since 0.9.1
	 *
	 * @return {void}
	 */
	const resizeIframe = () => {
		contentRef.style.height = contentRef.contentWindow.document.documentElement.scrollHeight + 'px';
	};

	return (
		<WhiteBox
			header={
				<>
					<SecondaryButton size="small" onClick={onClose}>
						{__('Go Back', 'subscribe-to-comment-notifications-comment-converter')}
					</SecondaryButton>
					<span className="ml-4 text-xl text-primaryText font-bold">
						<HelpTip content={titleHelp}>{title}</HelpTip>
					</span>
				</>
			}
		>
			<div className="w-full">
				<div className="flex w-full justify-between">
					<div className="flex flex-col justify-between items-start">
						<div className="flex flex-row mb-4 ml-10">
							<span className="text-primaryText text-[22px] mr-3">{parsedSubject}</span>
							<img src={assets('email-preview/top-left-category.png')} />
						</div>
						<img className="opacity-30" src={assets('email-preview/top-left-to-from.png')} />
					</div>
					<div className="flex flex-col justify-between items-end">
						<img src={assets('email-preview/top-right-print-open-actions.png')} />
						<img className="opacity-30" src={assets('email-preview/top-right-date-reply-action.png')} />
					</div>
				</div>
				<iframe ref={setContentRef} className="w-full my-6" onLoad={resizeIframe}>
					{mountNode && createPortal(<div dangerouslySetInnerHTML={{ __html: parsedContent }} />, mountNode)}
				</iframe>
				<div className="flex w-full">
					<img src={assets('email-preview/bottom-action-buttons.png')} />
				</div>
			</div>
		</WhiteBox>
	);
}

EmailPreview.propTypes = {
	content: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	subject: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	titleHelp: PropTypes.string.isRequired,
};
