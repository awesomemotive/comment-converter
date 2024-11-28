import PropTypes from 'prop-types';
import { CheckboxInputBase } from './CheckboxInputBase';

export function CheckboxGroupBase(props) {
	const { className, name, options, onChange, CheckboxInputComponent = CheckboxInputBase, value = [] } = props;

	/**
	 * Handles the change event for the checkbox group.
	 *
	 * @param {boolean} checked       - The checked state of the checkbox.
	 * @param {string}  name          - The name of the checkbox group.
	 * @param {Object}  options       - The options object.
	 * @param {Event}   options.event - The change event.
	 */
	const handleChange = (checked, name, { event }) => {
		const { value: optionValue } = event.target;

		if (value.includes(optionValue) && !checked) {
			onChange(
				value.filter((v) => v !== optionValue),
				name
			);
			return;
		}

		if (!value.includes(optionValue) && checked) {
			onChange([...value, optionValue], name);
		}
	};

	return (
		<div className={className}>
			{options.map((option) => (
				<CheckboxInputComponent
					key={option.value}
					name={name}
					label={option.label}
					value={option.value}
					checked={value.includes(option.value)}
					disabled={option.disabled}
					onChange={handleChange}
				/>
			))}
		</div>
	);
}

CheckboxGroupBase.propTypes = {
	CheckboxInputComponent: PropTypes.elementType,
	className: PropTypes.string,
	name: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			disabled: PropTypes.bool,
			label: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired,
		})
	),
	value: PropTypes.arrayOf(PropTypes.string),
};
