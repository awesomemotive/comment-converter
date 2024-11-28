import React from '@wordpress/element';
import styled from 'styled-components';
import tw from 'twin.macro';
import { YesNoSwitchBase } from '../../Lib/Components/Inputs/YesNoSwitchBase';

const StyledYesNoSwitch = styled(YesNoSwitchBase)`
	& > span {
		${tw`text-primaryText text-sm font-bold`};
	}

	.YesNoSwitch__no,
	.YesNoSwitch__yes {
		${tw`text-primaryText text-sm`};
		${tw`px-5 py-[10px]`};
		${tw`bg-neutral20 border border-neutral80`};

		&.YesNoSwitch--active {
			${tw`text-white bg-green300 border-green300`};
		}
	}

	.YesNoSwitch__no {
		${tw`rounded-l rtl:rounded-none rtl:!rounded-r`};
	}

	.YesNoSwitch__yes {
		${tw`rounded-r rtl:rounded-none rtl:!rounded-l`};
	}

	&.YesNoSwitch--label-top {
		& > span {
			${tw`mb-[5px]`};
		}
	}

	&.YesNoSwitch--label-left {
		${tw`items-center justify-between`};

		& > span {
			${tw`mr-[5px]`};
		}
	}

	&.YesNoSwitch--label-right {
		& > span {
			${tw`ml-[5px]`};
		}
	}

	&.YesNoSwitch--disabled {
		${tw`opacity-50`};
	}
`;

export function YesNoSwitch(props) {
	return <StyledYesNoSwitch {...props} />;
}

YesNoSwitch.propTypes = {
	...YesNoSwitchBase.propTypes,
};
