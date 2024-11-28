import PropTypes from 'prop-types';
import { TextLinkButton } from '../../Buttons/BaseButton';
import { RowActions } from './RowActions';

export function UserCell(props) {
	const {
		actions = [],
		name,
		email,
		avatarSrc,
		onActionClick = () => {},
		row,
	} = props;

	const displayName = name || 'Anonymous';

	/**
	 * Handles a click event on the email button.
	 *
	 * @param {Event} e The click event.
	 *
	 * @return {void}
	 */
	const handleClick = (e) => {
		e.preventDefault();
		onActionClick('edit', row);
	};

	return (
		<div className="flex">
			<img
				className="w-8 h-8 mr-2 rtl:!mr-0 rtl:ml-2 rounded-sm"
				alt={displayName}
				src={avatarSrc}
			/>
			<div className="flex flex-col">
				<span className="text-xs font-bold text-primaryText">
					{displayName}
				</span>
				<TextLinkButton
					className="mb-1.5"
					onClick={handleClick}
					size="small"
				>
					{email}
				</TextLinkButton>
				<RowActions
					actions={actions}
					onClick={onActionClick}
					row={row}
				/>
			</div>
		</div>
	);
}

UserCell.propTypes = {
	actions: PropTypes.array,
	avatarSrc: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
	name: PropTypes.string,
	onActionClick: PropTypes.func,
	row: PropTypes.object,
};
