import { SelectInput } from '../../Common/Inputs/SelectInput';
import {
	FOLLOW_TYPE_ALL_COMMENTS,
	FOLLOW_TYPE_COMMENT_REPLIES,
	FOLLOW_TYPE_NO_FOLLOW,
	followTypeOptions,
} from '../../Common/dropdownValues';
import { IconCheck2, IconRefresh, IconWarning } from '../../Common/Icons';
import classNames from 'classnames';
import { useUpdateFollowsMutation } from '../../store/localApi';
import styled from 'styled-components';
import tw from 'twin.macro';
import { parseErrorResponse } from '../../utils/error';
import { Tooltip } from '../../Lib/Components/Tooltip/Tooltip';

const ErrorTooltip = styled(Tooltip)`
	${tw`border rounded text-neutral600 border-red300 bg-red50`};
`;

export const FollowTypeSelectInput = (props) => {
	const { id, commentId, onUnsubscribe, ...rest } = props;

	const [updateFollows, updateFollowsResult] = useUpdateFollowsMutation();

	// Don't show option to follow replies if we don't have a comment ID to follow.
	const parsedFollowTypeOptions = followTypeOptions.filter(
		(option) => option.value !== FOLLOW_TYPE_COMMENT_REPLIES || commentId
	);

	/**
	 * Handle the change event of the follow type dropdown.
	 *
	 * @param {string} newType
	 *
	 * @return {void}
	 */
	const handleChange = (newType) => {
		let action;

		// Map the type with one of the bulk-actions to update follow types.
		switch (newType) {
			case FOLLOW_TYPE_COMMENT_REPLIES:
				action = 'follow-replies';
				break;
			case FOLLOW_TYPE_ALL_COMMENTS:
				action = 'follow-all';
				break;
			case FOLLOW_TYPE_NO_FOLLOW:
				return onUnsubscribe(id);
		}

		if (!action) {
			return;
		}

		updateFollows({ action, ids: [id] });
	};

	const statusIconClasses = classNames('ml-[5px] rtl:!ml-0 rtl:mr-[5px]', {
		'text-primaryText animate-spin': updateFollowsResult.isLoading,
		'text-primaryGreen': updateFollowsResult.isSuccess,
		'text-primaryRed': updateFollowsResult.isError,
	});

	// Reset the submission status icon after 2 seconds.
	const resetStatusIcon = () => {
		setTimeout(() => {
			updateFollowsResult.reset();
		}, 2000);
	};

	let StatusIcon = null;

	if (updateFollowsResult.isLoading) {
		StatusIcon = IconRefresh;
	} else if (updateFollowsResult.isError) {
		StatusIcon = IconWarning;
	} else if (updateFollowsResult.isSuccess) {
		StatusIcon = IconCheck2;
		resetStatusIcon();
	}

	return (
		<div className="flex items-center">
			<SelectInput options={parsedFollowTypeOptions} onChange={handleChange} {...rest} />
			{StatusIcon && !updateFollowsResult.isError ? (
				<StatusIcon width={14} className={statusIconClasses} />
			) : null}
			{StatusIcon && updateFollowsResult.isError ? (
				<ErrorTooltip
					appendTo="parent"
					content={parseErrorResponse(updateFollowsResult.error)}
					showOnCreate={true}
				>
					<span>
						<StatusIcon width={14} className={statusIconClasses} />
					</span>
				</ErrorTooltip>
			) : null}
		</div>
	);
};
