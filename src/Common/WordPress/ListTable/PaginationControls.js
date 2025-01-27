import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { TextInput } from '../../Inputs/TextInput';
import styled from 'styled-components';
import tw from 'twin.macro';
import classNames from 'classnames';

const StyledTextInput = styled(TextInput)`
	${tw`max-w-[30px]`}

	input {
		${tw`!px-0 !text-center`}
	}
`;
export function PaginationControls(props) {
	const { pageInput, totalPages, onChange, onApply } = props;

	if (totalPages <= 1) {
		return null;
	}

	const currPage = parseInt(props.currPage, 10);

	/**
	 * Handles a click event on the "First Page" button.
	 *
	 * @param {Event} e The click event.
	 *
	 * @return {void}
	 */
	const handleFirstPageClick = (e) => {
		e.preventDefault();
		onApply(1);
	};

	/**
	 * Handles a click event on the "Previous Page" button.
	 *
	 * @param {Event} e The click event.
	 *
	 * @return {void}
	 */
	const handlePreviousPageClick = (e) => {
		e.preventDefault();
		onApply(currPage - 1);
	};

	/**
	 * Handles a click event on the "Next Page" button.
	 *
	 * @param {Event} e The click event.
	 *
	 * @return {void}
	 */
	const handleNextPageClick = (e) => {
		e.preventDefault();
		onApply(currPage + 1);
	};

	/**
	 * Handles a click event on the "Last Page" button.
	 *
	 * @param {Event} e The click event.
	 *
	 * @return {void}
	 */
	const handleLastPageClick = (e) => {
		e.preventDefault();
		onApply(totalPages);
	};

	/**
	 * Handles a change event on the page input field.
	 *
	 * @param {string} newValue The new value.
	 *
	 * @return {void}
	 */
	const handlePageInputChange = (newValue) => {
		onChange(newValue);
	};

	/**
	 * Handles a key down event on the page input field.
	 *
	 * @param {Event} e The key down event.
	 *
	 * @return {void}
	 */
	const handlePageInputKeyDown = (e) => {
		if (e.code === 'Enter' && !isNaN(pageInput)) {
			onApply(parseInt(pageInput, 10));
		}
	};

	/**
	 * Renders a page button.
	 *
	 * @param {string}   slug     The button slug.
	 * @param {string}   label    The button label.
	 * @param {string}   arrow    The button arrow.
	 * @param {Function} onClick  The click event handler for the button.
	 * @param {boolean}  disabled Whether the button is disabled.
	 *
	 * @return {JSX.Element} The page button JSX element.
	 */
	const renderPageBtn = (slug, label, arrow, onClick, disabled) => {
		const classes = classNames(
			'flex justify-center items-center border rounded w-[30px] h-[30px] text-xl leading-none pb-[1px]',
			{
				'bg-neutral10 border-neutral80 text-neutral200 hover:bg-white hover:border-neutral100 hover:text-neutral400':
					!disabled,
				'bg-transparent border-neutral40 text-neutral60': disabled,
			}
		);

		return (
			<button className={classes} onClick={onClick} disabled={disabled} aria-hidden={disabled} aria-label={label}>
				{arrow}
			</button>
		);
	};

	return (
		<span className="flex items-center gap-x-[5px]">
			{renderPageBtn(
				'first-page',
				__('First page', 'subscribe-to-comment-notifications-comment-converter'),
				'«',
				handleFirstPageClick,
				currPage === 1
			)}
			{renderPageBtn(
				'previous-page',
				__('Previous page', 'subscribe-to-comment-notifications-comment-converter'),
				'‹',
				handlePreviousPageClick,
				currPage === 1
			)}

			<span className="flex items-center gap-x-[5px]">
				<StyledTextInput
					className="max-w-8"
					label={__('Current Page', 'subscribe-to-comment-notifications-comment-converter')}
					labelHidden={true}
					name="paged"
					value={pageInput}
					aria-describedby="table-paging"
					onChange={handlePageInputChange}
					onKeyDown={handlePageInputKeyDown}
					size="small"
				/>
				<span className="text-xs text-primaryText">
					{' '}
					{__('of')} <span className="total-pages">{totalPages}</span>
				</span>
			</span>

			{renderPageBtn(
				'next-page',
				__('Next page', 'subscribe-to-comment-notifications-comment-converter'),
				'›',
				handleNextPageClick,
				currPage === totalPages
			)}
			{renderPageBtn(
				'last-page',
				__('Last page', 'subscribe-to-comment-notifications-comment-converter'),
				'»',
				handleLastPageClick,
				currPage === totalPages
			)}
		</span>
	);
}

PaginationControls.propTypes = {
	currPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	onApply: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	pageInput: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	totalPages: PropTypes.number.isRequired,
};
