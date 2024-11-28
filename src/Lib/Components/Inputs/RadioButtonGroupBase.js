import PropTypes from 'prop-types';
import { RadioButtonInputBase } from './RadioButtonInputBase';

export function RadioButtonGroupBase(props) {
	const { className, name, options, onChange, RadioButtonInputComponent = RadioButtonInputBase, value } = props;

	/**
	 * Handles the change event for the radio button group.
	 *
	 * @param {boolean} checked       - The checked state of the radio button.
	 * @param {string}  name          - The name of the radio button group.
	 * @param {Object}  options       - The options object.
	 * @param {Event}   options.event - The change event.
	 */
	const handleChange = (checked, name, { event }) => {
		const { value: optionValue } = event.target;

		onChange(optionValue, name);
	};

	return (
		<div className={className}>
			{options.map((option) => (
				<RadioButtonInputComponent
					key={option.value}
					name={name}
					label={option.label}
					value={option.value}
					checked={value === option.value}
					disabled={option.disabled}
					onChange={handleChange}
				/>
			))}
		</div>
	);
}

RadioButtonGroupBase.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			disabled: PropTypes.bool,
			label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
			value: PropTypes.string.isRequired,
		})
	),
	RadioButtonInputComponent: PropTypes.elementType,
	value: PropTypes.string,
};
