import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isFunction from 'lodash/isFunction';
import { InputLabelWrapper } from './InputLabelWrapper';
import classnames from 'classnames';
import { useLodashDebounce } from '../../hooks/useLodashDebounce';

const StyledLabel = styled.label`
	display: flex;

	input {
		font-family: inherit;
		width: 100%;
		box-sizing: border-box;
	}

	&.TextInput--label-top {
		flex-direction: column;
	}

	&.TextInput--label-right,
	&.TextInput--label-left {
		align-items: center;
	}

	&.TextInput--label-right {
		flex-direction: row-reverse;
		justify-content: flex-end;
	}
`;

const InputWrapper = styled.div`
	position: relative;
`;

const IconButton = styled.button`
	position: absolute;
	right: 0px;
	top: 0px;
	height: 100%;

	svg {
		max-height: 100%;
	}
`;

export function TextInputBase(props) {
	const {
		className,
		debounceWait,
		iconButton,
		inputRef,
		label,
		labelHidden,
		labelPosition,
		name,
		onBlur,
		onChange,
		onEnter,
		onFocus,
		onIconButtonClick,
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

			if (isFunction(onEnter) && 'Enter' === event.key) {
				onEnter(event);
			}
		},
		[name, onChange, onKeyUp, onEnter]
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

	const classes = classnames(className, `TextInput TextInput--label-${labelPosition || 'top'}`, {
		'TextInput--disabled': rest.disabled,
	});

	return (
		<StyledLabel className={classes}>
			<InputLabelWrapper labelHidden={labelHidden}>{label}</InputLabelWrapper>
			<InputWrapper>
				{iconButton && (
					<IconButton className="TextInput__iconButton" onClick={onIconButtonClick}>
						{iconButton}
					</IconButton>
				)}
				<input
					name={name}
					onBlur={handleBlur}
					onChange={handleChange}
					onFocus={handleFocus}
					onKeyUp={debouncedOnKeyUp}
					ref={inputRef}
					value={isEditing ? valueState : value}
					type="text"
					{...rest}
				/>
			</InputWrapper>
		</StyledLabel>
	);
}

TextInputBase.propTypes = {
	className: PropTypes.string,
	debounceWait: PropTypes.number,
	disabled: PropTypes.bool,
	iconButton: PropTypes.node,
	inputRef: PropTypes.object,
	label: PropTypes.node.isRequired,
	labelHidden: PropTypes.bool,
	labelPosition: PropTypes.oneOf(['top', 'right', 'left']),
	name: PropTypes.string.isRequired,
	onBlur: PropTypes.func,
	onChange: PropTypes.func.isRequired,
	onEnter: PropTypes.func,
	onFocus: PropTypes.func,
	onIconButtonClick: PropTypes.func,
	onKeyUp: PropTypes.func,
	placeholder: PropTypes.string,
	type: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
