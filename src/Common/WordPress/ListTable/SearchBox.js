import PropTypes from 'prop-types';
import { TextInput } from '../../Inputs/TextInput';
import { SecondaryButton } from '../../Buttons/BaseButton';
import { __ } from '@wordpress/i18n';

export function SearchBox(props) {
	const { value, onInputChange, onSearchClick } = props;

	/**
	 * Handles a search input change event.
	 *
	 * @param {string} newValue The new value.
	 *
	 * @return {void}
	 */
	const handleSearchInputChange = (newValue) => {
		onInputChange(newValue);
	};

	return (
		<div className="flex items-center gap-x-1.5">
			<TextInput
				label={__('Search:', 'comment-notifications')}
				labelHidden={true}
				name="s"
				onChange={handleSearchInputChange}
				onEnter={onSearchClick}
				size="small"
				type="search"
				value={value || ''}
			/>
			<SecondaryButton onClick={onSearchClick} size="small">
				{__('Search', 'comment-notifications')}
			</SecondaryButton>
		</div>
	);
}

SearchBox.propTypes = {
	onInputChange: PropTypes.func.isRequired,
	onSearchClick: PropTypes.func.isRequired,
	value: PropTypes.string,
};
