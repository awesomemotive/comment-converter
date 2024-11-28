import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import { InputLabelWrapper } from './InputLabelWrapper';
import classnames from 'classnames';
import isFunction from 'lodash/isFunction';

const StyledLabel = styled.label`
	display: flex;

	&.SelectInput--label-top {
		flex-direction: column;
	}
`;

export function SelectInputBase(props) {
	const {
		className,
		creatable,
		isLoading,
		isMulti,
		label,
		labelHidden,
		labelPosition,
		loadingMessage = 'Loading...',
		name,
		onChange,
		onInputChange,
		onKeyDown,
		options,
		value,
		...rest
	} = props;
	const [inputValue, setInputValue] = useState('');

	/**
	 * Handle the input change event.
	 *
	 * @param {string} inputValue The new input value created.
	 * @param {Object} actionMeta The action meta data.
	 *
	 * @return {void}
	 */
	const handleInputChange = (inputValue, actionMeta) => {
		setInputValue(inputValue);

		if (isFunction(onInputChange)) {
			onInputChange(inputValue, actionMeta);
		}
	};

	/**
	 * Handle the Creatable keydown event.
	 *
	 * @param {Object} event The keydown event object.
	 *
	 * @return {void}
	 */
	const handleKeyDown = (event) => {
		// Bail if the input is empty.
		if (!inputValue) {
			return;
		}

		// If the pressed key is `Enter` or `Tab`, then we want to add the
		// input value as a selected item.
		switch (event.key) {
			case 'Enter':
			case 'Tab': {
				let currentValue = [];

				// Properly format any existing values before passing them along
				// to the select change handler.
				if (Array.isArray(value)) {
					currentValue = value.map((v) => {
						return v.label && v.name ? v : { label: v, value: v };
					});
				}

				// Merge all the selected objects, and store them in Redux.
				const newValue = isMulti
					? [...currentValue, { label: inputValue, value: inputValue }]
					: { label: inputValue, value: inputValue };
				handleChange(newValue);

				// Reset the `inputValue` state, now that we have dispatched
				// any existing input value.
				setInputValue('');

				// Block the default `Enter` and `Tab` keys behavior.
				event.preventDefault();

				break;
			}
			default:
				break;
		}

		if (isFunction(onKeyDown)) {
			onKeyDown(event);
		}
	};

	/**
	 * Handle the select change event.
	 *
	 * @param {Object} selectedObj The select change object.
	 * @param {Object} actionMeta  The select change action meta.
	 *
	 * @return {void}
	 */
	const handleChange = (selectedObj, actionMeta) => {
		const selected = Array.isArray(selectedObj) || selectedObj === null ? selectedObj : selectedObj.value;
		onChange(selected, name, { actionMeta, selectedObj });
	};

	/**
	 * Returns an array of selected value objects to be used by react-select.
	 *
	 * We store values differently than react-select passes them around, so we
	 * need to translate our stored values into something usable by react-select.
	 *
	 * @return {*} The select value.
	 */
	const getValue = () => {
		// Check if there's an option which value is an empty string
		const hasEmptyOption = options.some((o) => '' === o.value.toString());

		// If there's no existing value, default to an empty string or array.
		if (value === undefined || value === null || ('' === value && !hasEmptyOption)) {
			return isMulti ? [] : '';
		}

		const isArray = Array.isArray(value);

		// Creatable selects need to be handled differently. Otherwise, handle
		// anything else as if it's a standard react-select component.
		if (creatable) {
			// If it's multi and the value is not an array, default to an empty array.
			// Based on our usage, if the value is not array, then
			// something is likely to have gone wrong, so we just reset to an
			// empty array. This shouldn't cause problems, but if we do
			// encounter problems down the road, this is a starting point.
			if (isMulti && !isArray) {
				return [];
			}
		}

		// Convert non-array value to a label/value object.
		if ((value && !isArray) || value === '' || value === '0' || value === 0) {
			const optionValue = options.filter((o) => o.value.toString() === value.toString());

			// If not creatable, return only the value that matches a real option.
			if (!creatable) {
				return optionValue;
			}

			// For creatables, check if the option already exists. Otherwise, return a label/value object.
			return optionValue && optionValue.length ? optionValue.pop() : { label: value, value };
		}

		// If `value` is an array of strings, pull it's label/value objects from the options array.
		if (isArray && value.length && typeof value[0] !== 'object') {
			// If not creatable, return only the values that match a real option.
			if (!creatable) {
				return options.filter((o) => value.includes(o.value.toString()));
			}

			// For creatables, look for existing option values or return a label/value object if it can't find them.
			return value.map((singleValue) => {
				const optionValue = options.filter((o) => o.value.toString() === singleValue.toString());

				// Check if the option already exists. Otherwise, return a label/value object.
				return optionValue && optionValue.length
					? optionValue.pop()
					: { label: singleValue, value: singleValue };
			});
		}

		// The passed value is already in the proper format, so return it.
		return value;
	};

	const classNames = classnames(className, `SelectInput SelectInput--label-${labelPosition || 'top'}`, {
		'SelectInput--disabled': props.isDisabled,
	});
	const SelectComponent = creatable ? Creatable : Select;
	const creatableProps = {};

	// Add our `Creatable`-specific default props.
	if (creatable) {
		creatableProps.formatCreateLabel = (inputValue) => {
			return `Add "${inputValue}"`;
		};
		creatableProps.inputValue = inputValue;
		creatableProps.onKeyDown = handleKeyDown;
	}

	// If its loading and it has options, we need to add a disabled item to the end
	// to show the loading message.
	const customOptions =
		isLoading && options.length ? [...options, { label: loadingMessage, value: '', isDisabled: true }] : options;

	return (
		<StyledLabel className={classNames}>
			<InputLabelWrapper labelHidden={labelHidden}>{label}</InputLabelWrapper>
			<SelectComponent
				className="Select"
				classNamePrefix="Select"
				isLoading={isLoading}
				isMulti={isMulti}
				loadingMessage={() => loadingMessage}
				name={name}
				onChange={handleChange}
				onInputChange={handleInputChange}
				options={customOptions}
				value={getValue()}
				{...creatableProps}
				{...rest}
			/>
		</StyledLabel>
	);
}

SelectInputBase.propTypes = {
	className: PropTypes.string,
	components: PropTypes.object,
	creatable: PropTypes.bool,
	formatCreateLabel: PropTypes.func,
	inputValue: PropTypes.string,
	isDisabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	isMulti: PropTypes.bool,
	label: PropTypes.node.isRequired,
	labelHidden: PropTypes.bool,
	labelPosition: PropTypes.oneOf(['top', 'left']),
	loadingMessage: PropTypes.string,
	menuIsOpen: PropTypes.bool,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onInputChange: PropTypes.func,
	onKeyDown: PropTypes.func,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		})
	),
	styles: PropTypes.object,
	value: PropTypes.oneOfType([PropTypes.array, PropTypes.bool, PropTypes.number, PropTypes.string]),
};
