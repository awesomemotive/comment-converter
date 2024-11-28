import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { Accordion } from '../../../../Common/Layout/Accordion';
import { List, ListItem } from '../../../../Common/Layout/List';
import { IconPin, IconDocument } from '../../../../Common/Icons';
import { TextLink } from '../../../../Common/Buttons/BaseButton';
import { BadgeFollowerCount } from '../../../../Common/Badges/BadgeFollowerCount';
import { useNavigation } from '../../../hooks/useNavigation';

export const MostFollowed = ({ data }) => {
	const { goToPage } = useNavigation();

	return (
		<Accordion title={__('Most Followed', 'comment-notifications')}>
			{data && data.length > 0 && (
				<List>
					{data.map((item) => {
						const Icon = item.post.type === 'post' ? IconPin : IconDocument;

						return (
							<ListItem key={item.post.id}>
								<TextLink
									onClick={() => goToPage('followers', { post_id: item.post.id })}
									className="flex-nowrap justify-between items-center w-full !text-primaryText hover:!text-primaryBlue hover:!no-underline"
								>
									<div className="flex items-center">
										<Icon width="15" height="15" className="mr-2.5 rtl:!mr-0 rtl:ml-2.5 text-neutral900" />
										{item.post.title || __('(no title)', 'comment-notifications')}
									</div>
									<div>
										<BadgeFollowerCount>{item.count}</BadgeFollowerCount>
									</div>
								</TextLink>
							</ListItem>
						);
					})}
				</List>
			)}
		</Accordion>
	);
};

MostFollowed.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			count: PropTypes.number.isRequired,
			post: PropTypes.shape({
				title: PropTypes.string.isRequired,
				type: PropTypes.oneOf(['post', 'page']).isRequired,
				permalink: PropTypes.string.isRequired,
			}),
		})
	),
};
