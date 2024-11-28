import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';
import { InputLabelWrapper } from './InputLabelWrapper';
import get from 'lodash/get';

const StyledLabel = styled.label`
	display: inline-flex;

	&.YesNoSwitch--label-top {
		flex-direction: column;
	}

	&.YesNoSwitch--label-left {
		align-items: center;
	}

	input {
		opacity: 0;
		position: absolute;
	}

	.YesNoSwitch__toggle-wrapper {
		display: flex;
	}

	.YesNoSwitch__no,
	.YesNoSwitch__yes {
		border: 1px solid #ccc;
		padding: 5px 10px;
		background-color: #dedede;
		cursor: pointer;

		&.YesNoSwitch--active {
			background-color: green;
			border-color: green;
			color: white;
		}
	}
`;

export function YesNoSwitchBase(props) {
	const { checked, className, label, labelHidden, labelPosition, name, onChange, toggleContent, value, ...rest } =
		props;

	const classes = classnames(className, `YesNoSwitch--label-${labelPosition || 'top'}`, {
		'YesNoSwitch--checked': checked,
		'YesNoSwitch--unchecked': !checked,
		'YesNoSwitch--disabled': rest.disabled,
	});

	/**
	 * The toggle switch `onChange` event handler.
	 *
	 * @param {Object} event The event object.
	 *
	 * @return {void}
	 */
	const handleChange = (event) => {
		onChange(get(event, 'target.checked', false), name, { event });
	};

	return (
		<StyledLabel className={classes}>
			<InputLabelWrapper labelHidden={labelHidden}>{label}</InputLabelWrapper>
			<input
				checked={checked}
				name={name}
				onChange={handleChange}
				value={value || 'on'}
				{...rest}
				type="checkbox"
			/>
			<div className="YesNoSwitch__toggle-wrapper">
				<div className={classnames('YesNoSwitch__no', { 'YesNoSwitch--active': !checked })}>No</div>
				<div className={classnames('YesNoSwitch__yes', { 'YesNoSwitch--active': checked })}>Yes</div>
			</div>
		</StyledLabel>
	);
}

YesNoSwitchBase.propTypes = {
	checked: PropTypes.bool,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	label: PropTypes.node.isRequired,
	labelHidden: PropTypes.bool,
	labelPosition: PropTypes.oneOf(['top', 'left']),
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
