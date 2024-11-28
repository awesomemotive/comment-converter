import { useEffect, useState } from '@wordpress/element';
import PropTypes from 'prop-types';
import { sprintf, __ } from '@wordpress/i18n';
import { BulkActions } from './BulkActions';
import { FilterAction } from './FilterAction';
import { SearchBox } from './SearchBox';
import { PaginationControls } from './PaginationControls';
import { usePrevious } from '../../../Lib/hooks/usePrevious';
import isEqual from 'lodash/isEqual';
import { ColumnHeaders } from './ColumnHeaders';
import { CheckboxInput } from '../../Inputs/CheckboxInput';
import classNames from 'classnames';

/**
 * Parses a column definition object or string into a standard format.
 *
 * Columns can be defined as objects or strings.
 *
 * @param {Object|string} column The column definition object or string to parse.
 *
 * @return {Object} The parsed column object.
 */
const parseColumnDefinition = (column) => {
	if (typeof column === 'string') {
		column = {
			label: column,
		};
	}

	const { label, classes = '', sortable = false } = column;
	const slug = column.slug || label.toLowerCase();

	return { slug, label, classes, sortable };
};

export function WpListTable(props) {
	const {
		className = '',
		columns,
		rows,
		totalItems,
		verticalRowAlign = 'top',
		isLoading,

		bulkActionControl,
		filterControl = { hide: true },
		dateFilterControl,
		paginationControl,
		searchControl = { hide: true },
		sortControl,
	} = props;

	const [pageInput, setPageInput] = useState(paginationControl.current);
	const prevCurrPage = usePrevious(paginationControl.current);
	const [searchInput, setsearchInput] = useState(searchControl.value);

	const [selectedAction, setSelectedAction] = useState('');
	const [selectedFilter, setSelectedFilter] = useState(filterControl.value || '');
	const [selectedDateFilter, setSelectedDateFilter] = useState(dateFilterControl.value || '');

	const [selectedIds, setSelectedIds] = useState([]);

	const allIds = rows.map((row) => row.id);
	const prevAllIds = usePrevious(allIds);

	const isAllSelected = 0 < allIds.length && selectedIds.length === allIds.length;

	useEffect(() => {
		if (selectedIds.length && undefined !== prevAllIds && !isEqual(allIds, prevAllIds)) {
			// Reset the selected ids if the rows have changed.
			setSelectedIds([]);
		}
	}, [allIds, prevAllIds, selectedIds.length]);

	useEffect(() => {
		if (prevCurrPage !== paginationControl.current && pageInput !== paginationControl.current) {
			// External updates to the current page should be reflected in the state value for page input.
			setPageInput(paginationControl.current);
		}
	}, [pageInput, paginationControl, prevCurrPage]);

	/**
	 * Handles a click event on a sortable column header.
	 *
	 * @param {string} column    The column to sort by.
	 * @param {string} sortOrder The order to sort from.
	 *
	 * @return {void}
	 */
	const handleColumnClick = (column, sortOrder) => {
		sortControl.onApply(column, sortOrder);
	};

	/**
	 * Handles a search input change event.
	 *
	 * @param {string} search The new search query.
	 *
	 * @return {void}
	 */
	const handleSearchInputChange = (search) => {
		setsearchInput(search);
	};

	/**
	 * Handles a search button click event.
	 *
	 * @return {void}
	 */
	const handleSearchClick = () => {
		searchControl.onApply(searchInput);
	};

	/**
	 * Handles a filter change event.
	 *
	 * @param {string} type The new filter type.
	 *
	 * @return {void}
	 */
	const handleFilterChange = (type) => {
		setSelectedFilter(type);
	};

	/**
	 * Handles a date filter change event.
	 *
	 * @param {string} type The new filter type.
	 *
	 * @return {void}
	 */
	const handleDateFilterChange = (type) => {
		setSelectedDateFilter(type);
	};

	/**
	 * Handles a filter button click event.
	 *
	 * @return {void}
	 */
	const handleFilterClick = () => {
		filterControl.onApply({
			type: selectedFilter,
			date: selectedDateFilter,
		});
	};

	/**
	 * Handles a page input change event.
	 *
	 * @param {number} page The new page number.
	 *
	 * @return {void}
	 */
	const handlePageInputChange = (page) => {
		setPageInput(page);
	};

	/**
	 * Handles a page input enter event.
	 *
	 * @param {number} page The new page number.
	 *
	 * @return {void}
	 */
	const handlePageEnter = (page) => {
		setPageInput(page);
		paginationControl.onApply(page);
	};

	/**
	 * Handles a bulk action change event.
	 *
	 * @param {string} action The new bulk action.
	 *
	 * @return {void}
	 */
	const handleBulkActionChange = (action) => {
		setSelectedAction(action);
	};

	/**
	 * Handles a bulk action button click event.
	 *
	 * @return {void}
	 */
	const handleBulkActionClick = () => {
		if (!selectedAction) {
			return;
		}

		bulkActionControl.onApply(selectedAction, selectedIds);

		// Reset row selection.
		setSelectedIds([]);
	};

	/**
	 * Handles a select all rows checkbox change event.
	 *
	 * @return {void}
	 */
	const handleSelectAllRows = () => {
		if (isAllSelected) {
			setSelectedIds([]);
			return;
		}

		setSelectedIds(allIds);
	};

	/**
	 * Handles a row select checkbox change event.
	 *
	 * @param {bool}   checked Whether the checkebox is checked.
	 * @param {string} name    The input name.
	 * @param {Object} extra   Extra params including the source event.
	 *
	 * @return {void}
	 */
	const handleSelectRow = (checked, name, extra) => {
		const { event } = extra;
		const id = parseInt(event.currentTarget.dataset.id, 10);

		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter((i) => i !== id));
			return;
		}

		setSelectedIds([...selectedIds, id]);
	};

	const parsedColumns = columns.map(parseColumnDefinition);

	/**
	 * Renders the column headers for the table.
	 *
	 * @return {JSX.Element} The column headers JSX element.
	 */
	const renderColumnHeaders = () => {
		return (
			<ColumnHeaders
				columns={parsedColumns}
				isAllSelected={isAllSelected}
				onColumnClick={handleColumnClick}
				onSelectAllRows={handleSelectAllRows}
				sortBy={sortControl.sortedBy}
				sortOrder={sortControl.sortedOrder}
			/>
		);
	};

	/**
	 * Renders a "No records found" row for the table.
	 *
	 * @return {JSX.Element} The "No records found" row JSX element.
	 */
	const renderNoRecordsRow = () => {
		return (
			<tr className="no-items">
				<td className="colspanchange" colSpan={parsedColumns.length + 1}>
					{__('No records found.', 'comment-notifications')}
				</td>
			</tr>
		);
	};

	/**
	 * Renders the rows for the table.
	 *
	 * @return {JSX.Element[]} An array of row JSX elements.
	 */
	const renderRows = () => {
		return rows.map((row) => {
			const {
				id,
				classes: extraRowClasses = '',
				data = [],
				redHighlight = false,
			} = row;

			const rowClasses = classNames(
				'border-b last:border-b-0 border-[#C9D0D6] odd:bg-[#F2F3F9]',
				extraRowClasses,
				{
					'!bg-[#fcf9e8]': redHighlight,
				}
			);

			const checkCellClasses = classNames(
				`w-full h-full flex pt-2 pb-2.5 pl-3 rtl:!pl-0 rtl:pr-3 border-l-4 rtl:!border-l-0 rtl:border-r-4 border-[transparent]`,
				{
					'items-start': 'top' === verticalRowAlign,
					'items-center': 'middle' === verticalRowAlign,
					'!border-[#e8142e]': redHighlight,
				}
			);

			return (
				<tr key={id} data-id={id} className={`${rowClasses}`}>
					<th scope="row" className="p-0">
						<div className={checkCellClasses}>
							<CheckboxInput
								label={__('Select', 'comment-notifications')}
								labelHidden={true}
								name="selected[]"
								data-id={id}
								onChange={handleSelectRow}
								checked={selectedIds.includes(id)}
							/>
						</div>
					</th>
					{parsedColumns.map((column, j) => {
						const { slug, classes: extraColClasses = '' } = column;

						const colClasses = classNames(
							`${slug} column-${slug}`,
							'pt-2 pb-2.5',
							`align-${verticalRowAlign}`,
							extraColClasses
						);

						return (
							<td key={`${slug}-${id}`} className={colClasses}>
								{data[j]}
							</td>
						);
					})}
				</tr>
			);
		});
	};

	/**
	 * Renders either the rows or a "No records found" row for the table.
	 *
	 * @return {JSX.Element} The rows or "No records found" row JSX element.
	 */
	const renderRowsOrPlaceholder = () => {
		if (rows.length === 0) {
			return renderNoRecordsRow();
		}

		return renderRows();
	};

	/**
	 * Renders the table navigation pages for the table.
	 *
	 * @return {JSX.Element} The table navigation pages JSX element.
	 */
	const renderTableNavPages = () => {
		const start = (paginationControl.current - 1) * paginationControl.size + 1;
		const end = Math.min(paginationControl.current * paginationControl.size, totalItems);

		const pageText = sprintf(
			/* translators: 1: Start of the range, 2: End of the range, 3: Total items */
			__('Showing %1$d to %2$d of %3$d entries', 'comment-notifications'),
			start,
			end,
			totalItems
		);

		return (
			<div className="WPListTable__pageNav flex items-center gap-x-[10px]">
				<span className="text-xs displaying-num text-primaryText">
					{pageText}
				</span>
				<PaginationControls
					currPage={paginationControl.current}
					displayPageInput={false}
					onApply={handlePageEnter}
					onChange={handlePageInputChange}
					pageInput={pageInput}
					totalPages={paginationControl.total}
				/>
			</div>
		);
	};

	/**
	 * Renders the bulk actions for the table.
	 *
	 * @return {JSX.Element} The bulk actions JSX element.
	 */
	const renderBulkActions = () => {
		return (
			<BulkActions
				actions={bulkActionControl.options}
				onApply={handleBulkActionClick}
				onChange={handleBulkActionChange}
				value={selectedAction}
			/>
		);
	};

	/**
	 * Renders the table top navigation for the table.
	 *
	 * @return {JSX.Element} The table navigation JSX element.
	 */
	const renderTableTopNav = () => {
		return (
			<div className="flex items-center justify-between mb-4 WPListTable__topNav">
				<div className="flex items-center gap-x-5">
					{renderBulkActions()}
					{!filterControl.hide ? (
						<FilterAction
							dateFilterControl={{
								options: dateFilterControl.options,
								onChange: handleDateFilterChange,
								value: selectedDateFilter,
							}}
							typeFilterControl={{
								options: filterControl.options,
								onChange: handleFilterChange,
								value: selectedFilter,
							}}
							onFilter={handleFilterClick}
						/>
					) : null}
				</div>
				<div>
					{!searchControl.hide ? (
						<SearchBox
							onInputChange={handleSearchInputChange}
							onSearchClick={handleSearchClick}
							value={searchInput}
						/>
					) : null}
				</div>
			</div>
		);
	};

	/**
	 * Renders the table bottom navigation for the table.
	 *
	 * @return {JSX.Element} The table navigation JSX element.
	 */
	const renderTableBottomNav = () => {
		return (
			<div className="flex items-center justify-between mt-4 WPListTable__bottomNav">
				<div>{renderBulkActions()}</div>
				<div>{renderTableNavPages()}</div>
			</div>
		);
	};

	const tableClasses = classNames('WPListTable__table w-full h-full bg-white border border-[#C9D0D6] overflow-auto', {
		'opacity-50': isLoading,
	});

	return (
		<div className={`WPListTable__wrapper w-full ${className}`}>
			{renderTableTopNav()}
			<table className={tableClasses}>
				<thead className="h-12">
					<tr className="h-12 border border-[#C9D0D6]">
						{renderColumnHeaders()}
					</tr>
				</thead>
				<tbody>{renderRowsOrPlaceholder()}</tbody>
				<tfoot>
					<tr className="h-12 border border-[#C9D0D6]">
						{renderColumnHeaders()}
					</tr>
				</tfoot>
			</table>
			{renderTableBottomNav()}
		</div>
	);
}

WpListTable.propTypes = {
	bulkActionControl: PropTypes.shape({
		onApply: PropTypes.func.isRequired,
		options: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string.isRequired,
				value: PropTypes.string.isRequired,
			})
		).isRequired,
	}),
	className: PropTypes.string,
	columns: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
				classes: PropTypes.string,
				label: PropTypes.string.isRequired,
				slug: PropTypes.string,
				sortable: PropTypes.bool,
			}),
		])
	).isRequired,
	filterControl: PropTypes.shape({
		hide: PropTypes.bool,
		onApply: PropTypes.func,
		options: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string.isRequired,
				value: PropTypes.string.isRequired,
			})
		),
		value: PropTypes.string,
	}),
	dateFilterControl: PropTypes.shape({
		options: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string.isRequired,
				value: PropTypes.string.isRequired,
			})
		),
		value: PropTypes.string,
	}),
	isLoading: PropTypes.bool,
	paginationControl: PropTypes.shape({
		current: PropTypes.PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
		onApply: PropTypes.func.isRequired,
		size: PropTypes.number.isRequired,
		total: PropTypes.number.isRequired,
	}),
	rows: PropTypes.arrayOf(
		PropTypes.shape({
			classes: PropTypes.string,
			data: PropTypes.arrayOf(PropTypes.node),
			id: PropTypes.number.isRequired,
		})
	).isRequired,
	searchControl: PropTypes.shape({
		hide: PropTypes.bool,
		onApply: PropTypes.func,
		value: PropTypes.string,
	}),
	sortControl: PropTypes.shape({
		onApply: PropTypes.func.isRequired,
		sortedBy: PropTypes.string,
		sortedOrder: PropTypes.oneOf(['asc', 'desc']),
	}).isRequired,
	totalItems: PropTypes.number.isRequired,
	verticalRowAlign: PropTypes.oneOf(['top', 'middle']),
};
