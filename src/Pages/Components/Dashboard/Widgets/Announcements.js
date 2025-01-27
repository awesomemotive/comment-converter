import { __ } from '@wordpress/i18n';
import { useGetAnnouncementsQuery } from '../../../../store/marketingApi';
import { Accordion } from '../../../../Common/Layout/Accordion';
import { List, ListItem } from '../../../../Common/Layout/List';
import { SecondaryButton, TextLink } from '../../../../Common/Buttons/BaseButton';
import { formatAnnouncement } from '../../../../utils/announcements';

export const Announcements = () => {
	const { data } = useGetAnnouncementsQuery();

	const formattedAnnouncements = data.map((announcement) => formatAnnouncement(announcement));

	return (
		formattedAnnouncements &&
		formattedAnnouncements.length > 0 && (
			<Accordion title={__('Announcements', 'subscribe-to-comment-notifications-comment-converter')}>
				<List>
					{formattedAnnouncements.map((item) => (
						<ListItem key={item.id}>
							<div className="flex flex-nowrap justify-between items-center w-full mb-[6px]">
								<TextLink
									href={item.link}
									target="_blank"
									rel="noopener noreferrer"
									size="medium"
									className="!text-primaryText hover:!text-primaryBlue hover:!no-underline"
								>
									{item.title}
								</TextLink>

								<span className="min-w-[120px] text-right rtl:text-left text-primaryText75 text-[11px] uppercase font-normal">
									{item.date}
								</span>
							</div>

							{item.excerpt && (
								<p className="text-xs text-gray leading-[18px] font-normal mb-2.5">{item.excerpt}</p>
							)}

							<SecondaryButton
								as={'a'}
								size="small"
								target="_blank"
								rel="noopener noreferrer"
								href={item.link}
							>
								{__('Learn More', 'subscribe-to-comment-notifications-comment-converter')}
							</SecondaryButton>
						</ListItem>
					))}
				</List>
				<div className="pt-4">
					<TextLink
						href="https://commentconverter.com/category/announcements/"
						target="_blank"
						rel="noopener noreferrer"
						size="small"
					>
						{__('More Announcements →', 'subscribe-to-comment-notifications-comment-converter')}
					</TextLink>
				</div>
			</Accordion>
		)
	);
};
