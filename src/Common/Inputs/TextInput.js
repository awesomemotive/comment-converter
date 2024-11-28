import PropTypes from 'prop-types';
import styled from 'styled-components';
import tw from 'twin.macro';
import { TextInputBase } from '../../Lib/Components/Inputs/TextInputBase';
import classNames from 'classnames';

const StyledTextInput = styled(TextInputBase)`
	& > span {
		${tw`font-bold text-primaryText`};
	}

	input {
		${tw`text-xs bg-white text-primaryText`};
		${tw`rounded-[3px] border border-neutral80`};
		${tw`flex items-center py-0 `};

		&::placeholder {
			${tw`text-neutral50`};
		}
	}

	&.TextInput--label-top {
		& > span {
			${tw`mb-[5px]`};
		}
	}

	&.TextInput--label-left {
		${tw`items-center justify-between`};

		& > span {
			${tw`mr-[5px]`};
		}
	}

	&.TextInput--label-right {
		& > span {
			${tw`ml-[5px]`};
		}
	}

	&.TextInput--disabled {
		${tw`opacity-50`};

		input {
			${tw`bg-neutral10`};
		}
	}

	&.TextInput--small {
		& > span {
			${tw`text-xs`};
		}

		input {
			${tw`h-[30px] px-2.5`};
		}
	}

	&.TextInput--medium {
		& > span {
			${tw`text-sm`};
		}

		input {
			${tw`h-[34px] px-4`};
		}
	}
`;

export function TextInput(props) {
	const { className, size = 'medium', ...rest } = props;

	const classes = classNames(className, `TextInput--${size}`);

	return <StyledTextInput className={classes} {...rest} />;
}

TextInput.propTypes = {
	...TextInputBase.propTypes,
	size: PropTypes.oneOf(['small', 'medium']),
};
