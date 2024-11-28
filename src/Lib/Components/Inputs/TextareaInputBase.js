import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isFunction from 'lodash/isFunction';
import { InputLabelWrapper } from './InputLabelWrapper';
import classnames from 'classnames';
import { useLodashDebounce } from '../../hooks/useLodashDebounce';

const StyledLabel = styled.label`
	display: flex;

	textarea {
		font-family: inherit;
	}

	&.TextareaInput--label-top {
		flex-direction: column;
	}
`;

export function TextareaInputBase(props) {
	const {
		className,
		debounceWait,
		inputRef,
		label,
		labelHidden,
		labelPosition,
		name,
		onBlur,
		onChange,
		onFocus,
		onKeyUp,
		value,
		...rest
	} = props;
	const [isEditing, setIsEditing] = useState(false);
	const [valueState, setValueState] = useState(value);

	useEffect(() => {
		if (!isEditing && value !== valueState) {
			setValueState(value);
		}
	}, [isEditing, valueState, value]);

	/**
	 * The `onKeyUp` input callback, debounced.
	 *
	 * @param {Object} event The `onKeyUp` event object.
	 *
	 * @return {void}
	 */
	const handleOnKeyUp = useCallback(
		(event) => {
			onChange(event.target.value, name, { event });

			if (isFunction(onKeyUp)) {
				onKeyUp(event);
			}
		},
		[name, onChange, onKeyUp]
	);
	const debouncedOnKeyUp = useLodashDebounce(handleOnKeyUp, debounceWait || 300);

	/**
	 * The `onBlur` input callback.
	 *
	 * @param {Object} event The `onBlur` event object.
	 *
	 * @return {void}
	 */
	const handleBlur = (event) => {
		// We no longer need the debounce, and we don't want it interfering with
		// the code below.
		debouncedOnKeyUp.cancel();

		setIsEditing(false);
		setValueState(event.target.value);

		// Call the `onChange` event before the `onBlur` callback, so that the
		// value is set ahead of time, and the `onBlur` can compare against the
		// correct value.
		onChange(event.target.value, name, { event });

		if (isFunction(onBlur)) {
			onBlur(event);
		}
	};

	/**
	 * The `onChange` input callback.
	 *
	 * @param {Object} event The `onChange` event object.
	 *
	 * @return {void}
	 */
	const handleChange = (event) => {
		setValueState(event.target.value);

		if (!isEditing) {
			onChange(event.target.value, name, { event });
		}
	};

	/**
	 * The `onFocus` input callback.
	 *
	 * @param {Object} event The `onFocus` event object.
	 *
	 * @return {void}
	 */
	const handleFocus = (event) => {
		if (isFunction(onFocus)) {
			onFocus(event);
		}

		setIsEditing(true);
		setValueState(value);
	};

	/**
	 * Persists the `onKeyUp` event.
	 *
	 * @param {Object} event The `onKeyUp` event object.
	 *
	 * @return {void}
	 */
	const onKeyUpEventPersister = (event) => {
		debouncedOnKeyUp(event);
	};

	const classes = classnames(className, `TextareaInput--label-${labelPosition || 'top'}`, {
		'TextareaInput--disabled': rest.disabled,
	});

	return (
		<StyledLabel className={classes}>
			<InputLabelWrapper labelHidden={labelHidden}>{label}</InputLabelWrapper>
			<textarea
				name={name}
				onBlur={handleBlur}
				onChange={handleChange}
				onFocus={handleFocus}
				onKeyUp={onKeyUpEventPersister}
				ref={inputRef}
				value={isEditing ? valueState : value}
				{...rest}
			/>
		</StyledLabel>
	);
}

TextareaInputBase.propTypes = {
	className: PropTypes.string,
	debounceWait: PropTypes.number,
	disabled: PropTypes.bool,
	inputRef: PropTypes.object,
	label: PropTypes.node.isRequired,
	labelHidden: PropTypes.bool,
	labelPosition: PropTypes.oneOf(['top', 'left']),
	name: PropTypes.string.isRequired,
	onBlur: PropTypes.func,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	onKeyUp: PropTypes.func,
	placeholder: PropTypes.string,
	rows: PropTypes.number,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default TextareaInputBase;
