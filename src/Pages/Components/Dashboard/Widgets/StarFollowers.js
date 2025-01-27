import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { Accordion } from '../../../../Common/Layout/Accordion';
import { List, ListItem } from '../../../../Common/Layout/List';
import { TextLink } from '../../../../Common/Buttons/BaseButton';
import { useNavigation } from '../../../hooks/useNavigation';
import { BadgeFollowCount } from '../../../../Common/Badges/BadgeFollowCount';

export const StarFollowers = ({ data }) => {
	const { goToPage } = useNavigation();

	return (
		<Accordion title={__('Star Followers', 'subscribe-to-comment-notifications-comment-converter')}>
			{data && data.length > 0 && (
				<List>
					{data.map((item) => (
						<ListItem key={item.follower.id}>
							<TextLink
								onClick={() => goToPage('follower', { id: item.follower.id })}
								className="flex-nowrap justify-between items-center w-full group !text-primaryText hover:!text-primaryBlue hover:!no-underline"
							>
								<div className="flex">
									<img
										className="w-5 h-5 mr-2.5 rtl:!mr-0 rtl:ml-2.5"
										src={item.follower.avatar}
										alt={item.follower.name}
									/>
									{item.follower.name}
								</div>
								<div>
									<BadgeFollowCount className="group-hover:bg-neutral900 group-hover:text-white ">
										{item.count}
									</BadgeFollowCount>
								</div>
							</TextLink>
						</ListItem>
					))}
				</List>
			)}
		</Accordion>
	);
};

StarFollowers.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			count: PropTypes.number.isRequired,
			follower: PropTypes.shape({
				avatar: PropTypes.string.isRequired,
				id: PropTypes.number.isRequired,
				name: PropTypes.string.isRequired,
			}),
		})
	),
};
