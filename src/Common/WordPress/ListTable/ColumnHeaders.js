import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { CheckboxInput } from '../../Inputs/CheckboxInput';

export function ColumnHeaders(props) {
	const { columns, isAllSelected, onColumnClick, onSelectAllRows, sortBy, sortOrder, withId } = props;

	const checkColumnExtraProps = withId ? { id: 'cb' } : {};

	/**
	 * Handles a click event on a sortable column header.
	 *
	 * @param {Event} e The click event.
	 *
	 * @return {void}
	 */
	const handleColumnClick = (e) => {
		e.preventDefault();

		const { column, sortable } = e.currentTarget.dataset;

		if ('true' === sortable) {
			const newsortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';

			onColumnClick(column, newsortOrder);
		}
	};

	return (
		<Fragment>
			<td {...checkColumnExtraProps} className="pl-4 rtl:!pl-0 rtl:pr-4 border-l-1 w-[40px] align-middle">
				<CheckboxInput
					label={__('Select All', 'comment-notifications')}
					labelHidden={true}
					name="select_all"
					onChange={onSelectAllRows}
					checked={isAllSelected}
				/>
			</td>
			{columns.map((column) => {
				const { slug, label, classes, sortable } = column;

				const columnClasses = classNames(
					`column-${slug} text-primaryText text-xs font-normal text-left group align-middle rtl:text-right`,
					{
						[classes]: classes,
					}
				);

				const sortIndicatorClasses = classNames(
					"before:font-['dashicons'] before:text-primaryText before:text-xl invisible",
					{
						"asc before:content-['\f142'] before:content-['\\f142']": sortOrder === 'asc', // Arrow up when sorting ascending.
						"group-hover:before:content-['\f140'] group-hover:before:content-['\\f140']": sortBy === slug && sortOrder === 'asc', // Invert arrow when hovering.

						"desc before:content-['\f140'] before:content-['\\f140']": sortOrder === 'desc', // Arrow down when sorting descending.
						"group-hover:before:content-['\f142'] group-hover:before:content-['\\f142']": sortBy === slug && sortOrder === 'desc', // Invert arrow when hovering.

						'group-hover:before:!visible': sortable, // Show the arrow when hovering.
						'before:!visible': sortBy === slug, // Show the arrow when sorting.
					}
				);

				return (
					<th
						key={slug}
						data-column={slug}
						data-sortable={sortable}
						scope="col"
						className={columnClasses}
						onClick={handleColumnClick}
					>
						{sortable ? (
							// eslint-disable-next-line jsx-a11y/anchor-is-valid
							<button className="flex items-center bg-white text-primaryBlue hover:text-primaryBlue">
								<span>{label}</span>
								<span className={sortIndicatorClasses}></span>
							</button>
						) : (
							label
						)}
					</th>
				);
			})}
		</Fragment>
	);
}

ColumnHeaders.propTypes = {
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			classes: PropTypes.string,
			label: PropTypes.string.isRequired,
			slug: PropTypes.string.isRequired,
			sortable: PropTypes.bool,
		})
	).isRequired,
	isAllSelected: PropTypes.bool.isRequired,
	onColumnClick: PropTypes.func.isRequired,
	onSelectAllRows: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	sortOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,
	withId: PropTypes.bool,
};
