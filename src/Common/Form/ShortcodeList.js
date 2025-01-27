import { __ } from '@wordpress/i18n';
import { IconCheck2, IconDuplicate } from '../Icons';
import { useCopyTextToClipboard } from '../../Lib/hooks/useCopyToClipboard';
import { Tooltip } from '../Tooltip/Tooltip';

const shortcodes = [
	[
		'[Post_Title]',
		__('Post Title', 'subscribe-to-comment-notifications-comment-converter'),
		'[Post_Title] ' +
			__(
				'Displays the post title and links to the post on the front end of the site',
				'subscribe-to-comment-notifications-comment-converter'
			),
	],
	/* [
		'[Comment_Author]',
		__('Comment Author', 'subscribe-to-comment-notifications-comment-converter'),
		'[Comment_Author] ' + __('Displays the comment author’s name', 'subscribe-to-comment-notifications-comment-converter'),
	],
	[
		'[Comment_Content]',
		__('Comment Content', 'subscribe-to-comment-notifications-comment-converter'),
		'[Comment_Content] ' + __('Displays the content of the comment', 'subscribe-to-comment-notifications-comment-converter'),
	],
	[
		'[View_Comment]',
		__('View Comment', 'subscribe-to-comment-notifications-comment-converter'),
		'[View_Comment] ' + __('Text link “View Comment” that links directly to the comment', 'subscribe-to-comment-notifications-comment-converter'),
	],
	[
		'[Reply_To_Comment]',
		__('Reply To Comment', 'subscribe-to-comment-notifications-comment-converter'),
		'[Reply_To_Comment] ' + __('Links to Reply to permalink', 'subscribe-to-comment-notifications-comment-converter'),
	],
	[
		'[Manage_Subscriptions]',
		__('Manage Subscriptions', 'subscribe-to-comment-notifications-comment-converter'),
		'[Manage_Subscriptions] ' + __('Links to the follower’s Dashboard on the website', 'subscribe-to-comment-notifications-comment-converter'),
	],
	[
		'[Unsubscribe]',
		__('Unsubscribe', 'subscribe-to-comment-notifications-comment-converter'),
		'[Unsubscribe] ' + __('Enables the follower to unsubscribe from notifications', 'subscribe-to-comment-notifications-comment-converter'),
	], */
];

function ShortcodeListItem({ variable, title, description }) {
	const { copied, copyText } = useCopyTextToClipboard();

	/**
	 * Copy the variable to the clipboard.
	 */
	const handleCopyVariable = () => {
		copyText(variable);
	};

	return (
		<li key={variable} className="flex items-center mb-5">
			{copied ? (
				<IconCheck2 className="w-[13px] h-[13px] text-primaryGreen" />
			) : (
				<Tooltip content={__('Copy To Clipboard', 'subscribe-to-comment-notifications-comment-converter')}>
					<span>
						<IconDuplicate
							className="w-[13px] h-[13px] text-primaryBlue cursor-pointer"
							onClick={handleCopyVariable}
						/>
					</span>
				</Tooltip>
			)}
			<span className="ml-1 rtl:!ml-0 rtl:mr-1 text-sm font-bold text-primaryText">{title}:</span>
			<span className="ml-1 rtl:!ml-0 rtl:mr-1 text-sm text-primaryText100">{description}</span>
		</li>
	);
}

export function ShortcodeList() {
	return (
		<ul className="flex flex-col">
			{shortcodes.map((shortcode) => {
				const [variable, title, description] = shortcode;

				return <ShortcodeListItem key={variable} variable={variable} title={title} description={description} />;
			})}
		</ul>
	);
}
