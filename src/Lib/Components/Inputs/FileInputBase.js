import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputLabelWrapper } from './InputLabelWrapper';
import classnames from 'classnames';

const StyledLabel = styled.label`
	display: flex;

	input {
		appearance: none;
		display: none;
	}

	&.FileInput--label-top {
		flex-direction: column;
	}

	&.FileInput--label-right,
	&.FileInput--label-left {
		align-items: center;
	}

	&.FileInput--label-right {
		flex-direction: row-reverse;
		justify-content: flex-end;
	}
`;

const InputWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 5px;
`;

const RegularButton = (props) => <button {...props} />;

export function FileInputBase(props) {
	const {
		ButtonComponent = RegularButton,
		buttonText = 'Upload',
		className,
		label,
		labelHidden,
		labelPosition,
		name,
		onChange,
		placeholder = 'No file selected',
		value,
		...rest
	} = props;

	const inputRef = useRef(null);

	/**
	 * The `onChange` input callback.
	 *
	 * @param {Object} event The `onChange` event object.
	 *
	 * @return {void}
	 */
	const handleChange = (event) => {
		onChange(event.target.files[0], name, { event });
	};

	/**
	 * The `onClick` button callback.
	 *
	 * @param {Object} event The `onClick` event object.
	 *
	 * @return {void}
	 */
	const handleBtnClick = (event) => {
		inputRef.current.click();
	};

	const classes = classnames(className, `FileInput--label-${labelPosition || 'top'}`, {
		'FileInput--disabled': rest.disabled,
	});

	return (
		<StyledLabel className={classes}>
			<InputLabelWrapper labelHidden={labelHidden}>{label}</InputLabelWrapper>
			<InputWrapper className="FileInput--input-wrapper">
				<ButtonComponent onClick={handleBtnClick}>{buttonText}</ButtonComponent>
				<input {...rest} name={name} onChange={handleChange} type="file" ref={inputRef} />
				<span>{value ? value.name : placeholder}</span>
			</InputWrapper>
		</StyledLabel>
	);
}

FileInputBase.propTypes = {
	ButtonComponent: PropTypes.elementType,
	buttonText: PropTypes.string,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	label: PropTypes.node.isRequired,
	labelHidden: PropTypes.bool,
	labelPosition: PropTypes.oneOf(['top', 'right', 'left']),
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	value: PropTypes.object,
};
