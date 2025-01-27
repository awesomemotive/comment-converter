import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { PageBody } from '../Common/Layout/PageBody';
import { useGetFollowerQuery, useUpdateFollowerMutation } from '../store/localApi';
import { FollowsTable } from '../Components/FollowsTable/FollowsTable';
import { FollowerForm } from '../Common/Form/FollowerForm';
import { columns } from '../Components/FollowsTable/followColumns';
import styled from 'styled-components';
import tw from 'twin.macro';
import { WhiteBox } from '../Common/Layout/WhiteBox';
import { Loading } from '../Common/Layout/Loading';
import { Alert } from '../Common/Alert/Alert';
import { parseErrorResponse } from '../utils/error';
import { OutputMessage } from './OutputMessage';
import { useDispatch } from 'react-redux';
import { setFollowerId } from '../store/slices/currFollowerSlice';
import { usePrevious } from '../Lib/hooks/usePrevious';

const StyledWhiteBox = styled(WhiteBox)`
	.TextInput,
	.SelectInput {
		${tw`mb-0`};

		& > span {
			${tw`text-black`};
		}
	}

	.TextInput {
		input {
			${tw`text-black border-[#abb7ce]`};
		}
	}

	.SelectInput {
		.Select,
		.Select__single-value {
			${tw`text-black`};
		}

		.Select__control {
			${tw`border-[#abb7ce]`};
		}

		.Select__option {
			&--is-focused {
				${tw`text-black`}
			}

			&--is-selected {
				${tw`text-black`}
			}
		}

		.Select__option--is-focused.Select__option--is-selected {
			${tw`text-black`}
		}

		.Select__indicator {
			${tw`text-black`}

			&:hover svg {
				${tw`text-black`}
			}
		}
	}

	.WPListTable__wrapper {
		.WPListTable__table {
			${tw`m-0 border-[#f1f1f1]`}

			thead,
			tfoot {
				tr {
					${tw`border-[#f1f1f1]`}

					th {
						${tw`text-[#23282d]`}

						button {
							${tw`text-[#23282d]`}
						}
					}
				}
			}

			tbody {
				tr {
					${tw`border-0 h-[65px]`}

					td {
						& > span {
							${tw`text-[#6c7781]`}
						}
					}
				}

				tr:nth-child(odd) {
					${tw`bg-[#f7f8fb]`}
				}
			}
		}

		.WPListTable__pageNav {
			span {
				${tw`text-[#23282d]`}
			}
		}

		.WPListTable__topNav,
		.WPListTable__bottomNav {
			.SelectInput {
				.Select,
				.Select__single-value {
					${tw`text-[#555d66]`};
				}

				.Select__option {
					&--is-focused {
						${tw`text-[#555d66]`}
					}

					&--is-selected {
						${tw`text-[#555d66]`}
					}
				}

				.Select__option--is-focused.Select__option--is-selected {
					${tw`text-[#555d66]`}
				}

				.Select__indicator {
					${tw`text-[#555d66]`}

					&:hover svg {
						${tw`text-[#555d66]`}
					}
				}
			}
		}

		.btn-secondary {
			${tw`bg-[#fafafb] border-[#c9d0d6] text-[#555d66]`}

			&:hover {
				${tw`bg-white border-[#555d66]`}
			}
		}
	}

	button {
		&:hover {
			${tw`no-underline`}
		}

		&.btn-primary {
			${tw`bg-primaryBlue border-primaryBlue`}

			&:hover {
				${tw`bg-blue200 border-blue200`}
			}
		}
	}
`;

export const Dashboard = (props) => {
	const { followerId } = props;
	const prevFollowerId = usePrevious(followerId);

	const { data, error, isLoading } = useGetFollowerQuery(followerId);

	const [updateFollower, updateFollowerResult] = useUpdateFollowerMutation();

	const dispatch = useDispatch();

	useEffect(() => {
		if (followerId !== prevFollowerId) {
			dispatch(setFollowerId(followerId));
		}
	}, [dispatch, followerId, prevFollowerId]);

	useEffect(() => {
		if (updateFollowerResult.isSuccess && updateFollowerResult.data?.redirect_url) {
			window.location.href = updateFollowerResult.data?.redirect_url;
		}
	}, [updateFollowerResult]);

	/**
	 * Handles the saving of the follower data.
	 *
	 * @since 0.9.1
	 *
	 * @param {Object} formState - The follower form state.
	 */
	const handleSaveSettings = (formState) => {
		updateFollower(formState);
	};

	if (isLoading || error) {
		return <PageBody>{isLoading ? <Loading /> : <Alert type="error">{parseErrorResponse(error)}</Alert>}</PageBody>;
	}

	return (
		<PageBody>
			<StyledWhiteBox className="!shadow-none">
				<OutputMessage className="w-full mb-4" />
				<div className="flex flex-col mb-[30px]">
					<p className="text-base font-normal text-black">
						{__(
							'Manage your follower settings including name, email notifications, and how often you receive updates.',
							'subscribe-to-comment-notifications-comment-converter'
						)}
					</p>
				</div>
				<FollowerForm data={data} onSave={handleSaveSettings} submissionStatus={updateFollowerResult} />
				<hr className="w-full my-[52px] text-[#abb7ce] before:content-none after:content-none" />
				<h2 className="mx-0 mt-0 mb-4 text-lg font-semibold text-black">
					{__('Followed Comments', 'subscribe-to-comment-notifications-comment-converter')}
				</h2>
				<div className="w-full">
					<FollowsTable
						columns={[columns.FOLLOWED_FROM, columns.FOLLOW_TYPE, columns.CREATED, columns.ACTION]}
						disableFilter={true}
						disableSearch={true}
						followerId={followerId}
						isDoubleOptInEnabled={window.ccData.isDoubleOptInEnabled}
						verticalRowAlign="middle"
					/>
				</div>
			</StyledWhiteBox>
		</PageBody>
	);
};
