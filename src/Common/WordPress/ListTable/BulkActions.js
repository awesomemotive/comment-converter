import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { SelectInput } from '../../Inputs/SelectInput';
import { SecondaryButton } from '../../Buttons/BaseButton';

export function BulkActions(props) {
	const { value, actions = [], onChange, onApply } = props;

	const parsedActions = [
		{
			label: __('Bulk Actions', 'subscribe-to-comment-notifications-comment-converter'),
			value: '',
		},
		...actions,
	];

	/**
	 * Handles a change event on the bulk action select input.
	 *
	 * @param {string} newValue The new value.
	 *
	 * @return {void}
	 */
	const handleChange = (newValue) => {
		if (!newValue) {
			return;
		}

		onChange(newValue);
	};

	return (
		<div className="flex items-center gap-x-1.5">
			<SelectInput
				className="min-w-[220px]"
				label={__('Select bulk action', 'subscribe-to-comment-notifications-comment-converter')}
				labelHidden={true}
				name="bulk_action"
				value={value}
				options={parsedActions}
				onChange={handleChange}
				size="small"
			/>
			<SecondaryButton onClick={onApply} size="small">
				{__('Apply', 'subscribe-to-comment-notifications-comment-converter')}
			</SecondaryButton>
		</div>
	);
}

BulkActions.propTypes = {
	actions: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired,
		})
	),
	onChange: PropTypes.func.isRequired,
	onApply: PropTypes.func.isRequired,
	position: PropTypes.oneOf(['top', 'bottom']),
	value: PropTypes.string.isRequired,
};
