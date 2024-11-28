import PropTypes from 'prop-types';
import styled from 'styled-components';
import tw from 'twin.macro';
import { TextareaInputBase } from '../../Lib/Components/Inputs/TextareaInputBase';
import classNames from 'classnames';

const StyledTextareaInput = styled(TextareaInputBase)`
	& > span {
		${tw`font-bold text-primaryText`};
	}

	textarea {
		${tw`text-xs bg-white text-primaryText`};
		${tw`rounded-[3px] border border-neutral80`};

		&::placeholder {
			${tw`text-neutral50`};
		}
	}

	&.TextareaInput--label-top {
		& > span {
			${tw`mb-[5px]`};
		}
	}

	&.TextareaInput--label-left {
		${tw`items-center justify-between`};

		& > span {
			${tw`mr-[5px]`};
		}
	}

	&.TextareaInput--label-right {
		& > span {
			${tw`ml-[5px]`};
		}
	}

	&.TextareaInput--disabled {
		${tw`opacity-50`};

		textarea {
			${tw`bg-neutral10`};
		}
	}

	&.TextareaInput--small {
		& > span {
			${tw`text-xs`};
		}

		textarea {
			${tw`px-2.5 py-[5px]`};
		}
	}

	&.TextareaInput--medium {
		& > span {
			${tw`text-sm`};
		}

		textarea {
			${tw`px-4 py-2`};
		}
	}
`;

export function TextareaInput(props) {
	const { className, size = 'medium', ...rest } = props;

	const classes = classNames(className, `TextareaInput--${size}`);

	return <StyledTextareaInput className={classes} {...rest} />;
}

TextareaInput.propTypes = {
	...TextareaInputBase.propTypes,
	size: PropTypes.oneOf(['small', 'medium']),
};
