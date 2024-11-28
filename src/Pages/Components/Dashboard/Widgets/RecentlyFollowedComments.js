import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { Accordion } from '../../../../Common/Layout/Accordion';
import { List, ListItem } from '../../../../Common/Layout/List';
import { IconLogo } from '../../../../Common/Icons';
import { TextLink } from '../../../../Common/Buttons/BaseButton';
import { useNavigation } from '../../../hooks/useNavigation';

export const RecentlyFollowedComments = ({ data }) => {
	const { goToPage } = useNavigation();

	return (
		<Accordion title={__('Recently Followed Comments', 'comment-notifications')}>
			{data && data.length > 0 && (
				<List>
					{data.map((item) => (
						<ListItem key={item.comment.id}>
							<div className="mb-2.5">
								<TextLink
									onClick={() => goToPage('follower', { id: item.follower.id })}
									className="flex-wrap items-center !text-primaryText hover:!text-primaryBlue hover:!no-underline"
								>
									<img
										className="w-5 h-5 mr-2.5 rtl:!mr-0 rtl:ml-2.5"
										src={item.follower.avatar}
										alt={item.follower.name}
									/>
									<span className="mr-[3px] rtl:!mr-0 rtl:ml-[3px]">{item.follower.name}</span>
									<IconLogo height="14" type="orange" />
								</TextLink>
							</div>

							<blockquote className="py-1.5 px-4 text-[14px] leading-[18px] text-primaryText100 w-[512px] max-w-[512px] mb-[5px] bg-neutral20 rounded-[6px]">
								&ldquo;{item.comment.excerpt}&rdquo;
							</blockquote>

							<TextLink href={item.permalink} size="small" target="_blank">
								{item.title}
							</TextLink>
						</ListItem>
					))}
				</List>
			)}
		</Accordion>
	);
};

RecentlyFollowedComments.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			comment: PropTypes.shape({
				id: PropTypes.number.isRequired,
				excerpt: PropTypes.string.isRequired,
			}),
			follower: PropTypes.shape({
				avatar: PropTypes.string.isRequired,
				id: PropTypes.number.isRequired,
				name: PropTypes.string.isRequired,
			}),
			permalink: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
		})
	),
};
