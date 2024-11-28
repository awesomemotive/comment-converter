import { __ } from '@wordpress/i18n';
import { IconCheck2, IconDuplicate } from '../Icons';
import { useCopyTextToClipboard } from '../../Lib/hooks/useCopyToClipboard';
import { Tooltip } from '../Tooltip/Tooltip';

const shortcodes = [
	[
		'[Post_Title]',
		__('Post Title', 'comment-notifications'),
		'[Post_Title] ' +
			__('Displays the post title and links to the post on the front end of the site', 'comment-notifications'),
	],
	/* [
		'[Comment_Author]',
		__('Comment Author', 'comment-notifications'),
		'[Comment_Author] ' + __('Displays the comment author’s name', 'comment-notifications'),
	],
	[
		'[Comment_Content]',
		__('Comment Content', 'comment-notifications'),
		'[Comment_Content] ' + __('Displays the content of the comment', 'comment-notifications'),
	],
	[
		'[View_Comment]',
		__('View Comment', 'comment-notifications'),
		'[View_Comment] ' + __('Text link “View Comment” that links directly to the comment', 'comment-notifications'),
	],
	[
		'[Reply_To_Comment]',
		__('Reply To Comment', 'comment-notifications'),
		'[Reply_To_Comment] ' + __('Links to Reply to permalink', 'comment-notifications'),
	],
	[
		'[Manage_Subscriptions]',
		__('Manage Subscriptions', 'comment-notifications'),
		'[Manage_Subscriptions] ' + __('Links to the follower’s Dashboard on the website', 'comment-notifications'),
	],
	[
		'[Unsubscribe]',
		__('Unsubscribe', 'comment-notifications'),
		'[Unsubscribe] ' + __('Enables the follower to unsubscribe from notifications', 'comment-notifications'),
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
				<Tooltip content={__('Copy To Clipboard', 'comment-notifications')}>
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
