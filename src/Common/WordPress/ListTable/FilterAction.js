import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { SelectInput } from '../../Inputs/SelectInput';
import { SecondaryButton } from '../../Buttons/BaseButton';

export function FilterAction(props) {
	const { dateFilterControl, typeFilterControl, onFilter } = props;

	return (
		<div className="flex items-center gap-x-1.5">
			<SelectInput
				className="min-w-[120px]"
				label={__('Filter by date', 'comment-notifications')}
				labelHidden={true}
				name="filter_date_action"
				value={dateFilterControl.value}
				options={dateFilterControl.options}
				onChange={dateFilterControl.onChange}
				size="small"
			/>
			{typeFilterControl.options.length ? (
				<SelectInput
					className="min-w-[120px]"
					label={__('Filter by type', 'comment-notifications')}
					labelHidden={true}
					name="filter_action"
					value={typeFilterControl.value}
					options={typeFilterControl.options}
					onChange={typeFilterControl.onChange}
					size="small"
				/>
			) : null}
			<SecondaryButton onClick={onFilter} size="small">
				{__('Filter', 'comment-notifications')}
			</SecondaryButton>
		</div>
	);
}

FilterAction.propTypes = {
	onFilter: PropTypes.func.isRequired,
	dateFilterControl: PropTypes.shape({
		onChange: PropTypes.func.isRequired,
		options: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string.isRequired,
				value: PropTypes.string.isRequired,
			})
		).isRequired,
		value: PropTypes.string.isRequired,
	}).isRequired,
	typeFilterControl: PropTypes.shape({
		onChange: PropTypes.func.isRequired,
		options: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string.isRequired,
				value: PropTypes.string.isRequired,
			})
		).isRequired,
		value: PropTypes.string.isRequired,
	}).isRequired,
};
