import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputLabelWrapper } from './InputLabelWrapper';
import classnames from 'classnames';
import { TextInputBase } from './TextInputBase';
import { IconClose } from '../Icons';

const StyledLabel = styled.label`
	display: flex;

	&.TextListInput--label-top {
		flex-direction: column;
	}

	&.TextListInput--label-right,
	&.TextListInput--label-left {
		align-items: center;
	}

	&.TextListInput--label-right {
		flex-direction: row-reverse;
		justify-content: flex-end;
	}
`;

const ControlsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const InputWrapper = styled.div`
	display: flex;
	width: 100%;
	gap: 5px;

	.TextListInput-input {
		width: 100%;
	}

	.TextListInput-button {
		text-wrap: nowrap;
		white-space: nowrap;
	}
`;

const List = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	margin: 5px 0px;
`;

const ListItem = styled.div`
	display: flex;
	align-items: center;

	border-radius: 3px;
	background: #e9ecf3;
	padding: 4px 6px;
`;

const CloseButton = styled.button`
	appearance: none;
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 0px;
	margin-left: 5px;

	svg {
		width: 10px;
		height: 10px;
	}
`;

const RegularButton = (props) => <button {...props} />;

export function TextListInputBase(props) {
	const {
		ButtonComponent = RegularButton,
		CloseIcon = IconClose,
		TextInputComponent = TextInputBase,
		buttonText = 'Add',
		buttonProps,
		className,
		disabled,
		label,
		labelHidden,
		labelPosition,
		name,
		onChange,
		onBeforeChange = () => true,
	} = props;

	const textInputRef = useRef(null);

	const value = props.value || [];

	const [textInputValue, setTextInputValue] = useState('');

	/**
	 * The `onClick` add button callback.
	 *
	 * @return {void}
	 */
	const handleAddClick = () => {
		// Check value before adding it.
		const check = onBeforeChange(textInputValue, value, name);

		if (!check) {
			return;
		}

		onChange([...value, textInputValue], name);

		// TODO: fix resetting the input value onEnter not working due to how the TextInputBase
		// handles the value props versus the value state.
		setTextInputValue('');

		// Focus the input again after adding a value to offer a better UX.
		// The timeout is needed to account for how the TextInputBase handles the value props
		// versus the value state.
		setTimeout(() => {
			textInputRef.current.focus();
		}, 0);
	};

	/**
	 * The `onClick` remove button callback.
	 *
	 * @param {Object} event The `onClick` event object.
	 *
	 * @return {void}
	 */
	const handleRemoveClick = (event) => {
		const { value: toRemove } = event.currentTarget.dataset;
		onChange(
			value.filter((v) => v !== toRemove),
			name
		);
	};

	/**
	 * The `onChange` input callback.
	 *
	 * @param {Object} event The `onChange` event object.
	 *
	 * @param          value
	 * @return {void}
	 */
	const handleTextInputChange = (value) => {
		setTextInputValue(value);
	};

	const classes = classnames(className, `TextListInput--label-${labelPosition || 'top'}`, {
		'TextListInput--disabled': disabled,
	});

	return (
		<StyledLabel className={classes}>
			<InputLabelWrapper labelHidden={labelHidden}>{label}</InputLabelWrapper>
			<ControlsWrapper>
				<InputWrapper>
					<TextInputComponent
						className="TextListInput-input"
						inputRef={textInputRef}
						label="Add new item"
						labelHidden={true}
						name="newItemInput"
						onChange={handleTextInputChange}
						onEnter={handleAddClick}
						value={textInputValue}
					/>
					<ButtonComponent {...buttonProps} className="TextListInput-button" onClick={handleAddClick}>
						{buttonText}
					</ButtonComponent>
				</InputWrapper>
				<List className="TextListInput--list">
					{value.map((item) => (
						<ListItem key={item} className="TextListInput--list-item">
							{item}
							<CloseButton data-value={item} onClick={handleRemoveClick}>
								<CloseIcon />
							</CloseButton>
						</ListItem>
					))}
				</List>
			</ControlsWrapper>
		</StyledLabel>
	);
}

TextListInputBase.propTypes = {
	ButtonComponent: PropTypes.elementType,
	buttonText: PropTypes.string,
	buttonProps: PropTypes.object,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	label: PropTypes.node.isRequired,
	labelHidden: PropTypes.bool,
	labelPosition: PropTypes.oneOf(['top', 'right', 'left']),
	name: PropTypes.string.isRequired,
	onBeforeChange: PropTypes.func,
	onChange: PropTypes.func.isRequired,
	TextInputComponent: PropTypes.elementType,
	value: PropTypes.arrayOf(PropTypes.string),
};
