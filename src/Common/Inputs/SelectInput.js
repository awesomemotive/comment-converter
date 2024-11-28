import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SelectInputBase } from '../../Lib/Components/Inputs/SelectInputBase';
import tw from 'twin.macro';
import classNames from 'classnames';

const StyledSelect = styled(SelectInputBase)`
	& > span {
		${tw`font-bold text-primaryText`};
	}

	.Select {
		${tw`text-xs text-primaryText`};
	}

	.Select__control {
		${tw`bg-white rounded-[3px] border border-neutral80`};
		${tw`flex items-center py-0`};
	}

	.Select__value-container {
		${tw`p-0`}

		& > div {
			${tw`mx-0`}
		}
	}

	.Select__input-container {
		${tw`p-0 m-0`}
	}

	input.Select__input {
		${tw`text-xs bg-white text-primaryText !shadow-none`};
	}

	.Select__placeholder {
		${tw`text-neutral50`};
	}

	.Select__single-value {
		${tw`text-primaryText`}
	}

	.Select__menu {
		${tw`rounded-[3px] my-[5px]`}
	}

	.Select__menu-list {
		${tw`p-1`}
	}

	.Select__option {
		${tw`rounded-[3px] flex items-center`};
		${tw`mb-[2px] last:mb-0`};

		&--is-focused {
			${tw`bg-neutral20 text-primaryText`}
		}

		&--is-selected {
			${tw`bg-neutral30 text-primaryText`}
		}
	}

	.Select__option--is-focused.Select__option--is-selected {
		${tw`bg-neutral30 text-primaryText`}
	}

	.Select__indicator-separator {
		${tw`hidden`}
	}

	.Select__indicator {
		${tw`p-0 text-primaryText`}

		svg {
			${tw`relative right-[-5px]`}
		}

		&:hover svg {
			${tw`text-primaryText`}
		}
	}

	&.SelectInput--disabled {
		${tw`opacity-50`};
	}

	&.SelectInput--label-top {
		& > span {
			${tw`mb-[5px]`};
		}
	}

	&.SelectInput--label-left {
		${tw`items-center justify-between`};

		& > span {
			${tw`mr-[5px]`};
		}
	}

	&.SelectInput--label-right {
		& > span {
			${tw`ml-[5px]`};
		}
	}

	&.SelectInput--small {
		& > span {
			${tw`text-xs`};
		}

		.Select__control {
			${tw`min-h-[30px] max-h-[30px] px-2.5`};
		}

		.Select__option {
			${tw`text-xs py-1 px-1.5`}
		}
	}

	&.SelectInput--medium {
		& > span {
			${tw`text-sm`};
		}

		.Select__control {
			${tw`min-h-[34px] max-h-[34px] px-4`};
		}

		.Select__option {
			${tw`py-2 px-3 text-sm`}
		}
	}
`;

export function SelectInput(props) {
	const { className, disabled, isDisabled, size = 'medium', ...rest } = props;

	// Allow "disabled" like most other input components.
	const disabledProp = disabled || isDisabled;

	const classes = classNames(className, `SelectInput--${size}`);

	return (
		<StyledSelect className={classes} isDisabled={disabledProp} {...rest} />
	);
}

SelectInput.propTypes = {
	...SelectInputBase.propTypes,
	size: PropTypes.oneOf(['small', 'medium']),
};
