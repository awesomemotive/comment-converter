import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import { InputLabelWrapper } from './InputLabelWrapper';

const StyledLabel = styled.label`
	align-items: center;
	display: flex;
`;

export function CheckboxInputBase(props) {
	const {
		className,
		label,
		labelHidden = false,
		name,
		onChange,
		size,
		...rest
	} = props;

	const classes = classnames(
		className,
		'CheckboxInput',
		`CheckboxInput--${size || 'medium'}`,
		{
			'CheckboxInput--disabled': rest.disabled,
		}
	);

	/**
	 * The `onChange` input callback.
	 *
	 * @param {Object} event The `onChange` event object.
	 *
	 * @return {void}
	 */
	const handleChange = (event) => {
		onChange(event.target.checked, name, { event });
	};

	return (
		<StyledLabel className={classes}>
			<input
				name={name}
				onChange={handleChange}
				{...rest}
				type="checkbox"
			/>
			<InputLabelWrapper labelHidden={labelHidden}>
				{label}
			</InputLabelWrapper>
		</StyledLabel>
	);
}

CheckboxInputBase.propTypes = {
	checked: PropTypes.bool,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	label: PropTypes.node.isRequired,
	labelHidden: PropTypes.bool,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	size: PropTypes.oneOf(['small', 'medium']),
};
