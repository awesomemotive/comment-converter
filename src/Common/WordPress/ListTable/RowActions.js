import { Fragment } from '@wordpress/element';
import PropTypes from 'prop-types';
import { TextLinkButton } from '../../Buttons/BaseButton';
import { FOLLOW_TYPE_ALL_COMMENTS, FOLLOW_TYPE_COMMENT_REPLIES } from '../../dropdownValues';

export function RowActions(props) {
	const { actions, onClick, row } = props;

	/**
	 * Handles a click event on a row action button.
	 *
	 * @param {Event}  e      The click event.
	 * @param {Object} action The action object for the clicked button.
	 *
	 * @return {void}
	 */
	const handleClick = (e, action) => {
		e.preventDefault();
		onClick(action, row);
	};

	// Remove option to follow all if already following all. The same for following only replies.
	const filteredActions = actions.filter((action) => {
		if (
			('follow-all' === action.slug && row.type === FOLLOW_TYPE_ALL_COMMENTS) ||
			('follow-replies' === action.slug && row.type === FOLLOW_TYPE_COMMENT_REPLIES)
		) {
			return false;
		}

		return true;
	});

	return (
		<div className="flex items-center flex-wrap gap-x-1">
			{filteredActions.map((action, i) => {
				const { classes = '', label, slug } = action;

				return (
					<Fragment key={slug}>
						{0 < i ? <span className="text-[10px] leading-none text-primaryText">|</span> : null}
						<span data-action={slug}>
							<TextLinkButton
								aria-label={label}
								className={`text-nowrap flex-nowrap ${classes}`}
								onClick={(e) => handleClick(e, slug)}
								size="small"
							>
								{label}
							</TextLinkButton>
						</span>
					</Fragment>
				);
			})}
		</div>
	);
}

RowActions.propTypes = {
	actions: PropTypes.arrayOf(
		PropTypes.shape({
			slug: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
	onClick: PropTypes.func.isRequired,
	row: PropTypes.object.isRequired,
};
