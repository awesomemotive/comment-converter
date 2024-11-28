import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import { InputLabelWrapper } from './InputLabelWrapper';

const StyledLabel = styled.label`
	align-items: center;
	display: flex;
`;

export function RadioButtonInputBase(props) {
	const { className, label, name, onChange, size, ...rest } = props;

	const classes = classnames(className, `RadioButtonInput`, `RadioButtonInput--${size || 'medium'}`, {
		'RadioButtonInput--disabled': rest.disabled,
	});

	/**
	 * The `onChange` input callback.
	 *
	 * @param {Object} event The `onChange` event object.
	 *
	 * @return {void}
	 */
	const handleChange = (event) => {
		onChange(event.target.checked ? props.value : null, name, { event });
	};

	return (
		<StyledLabel className={classes}>
			<input name={name} onChange={handleChange} {...rest} type="radio" />
			<InputLabelWrapper>{label}</InputLabelWrapper>
		</StyledLabel>
	);
}

RadioButtonInputBase.propTypes = {
	checked: PropTypes.bool,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	label: PropTypes.node.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	size: PropTypes.oneOf(['small', 'medium']),
	value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};
