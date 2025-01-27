import { __ } from '@wordpress/i18n';
import { PageBody } from '../Common/Layout/PageBody';
import { WhiteBox } from '../Common/Layout/WhiteBox';
import * as urls from '../utils/urls';
import { useGetAMPluginsQuery, useUpdateAMPluginsMutation } from '../store/localApi';
import { ShadowBox } from '../Common/Layout/ShadowBox';
import { PrimaryButton, SecondaryButton } from '../Common/Buttons/BaseButton';
import classNames from 'classnames';
import { Loading } from '../Common/Layout/Loading';
import { Alert } from '../Common/Alert/Alert';
import { parseErrorResponse } from '../utils/error';

export const AboutUs = () => {
	const { data: amPlugins, error, isLoading } = useGetAMPluginsQuery();

	const [installActivatePlugin, installResult] = useUpdateAMPluginsMutation();

	/**
	 * Handles the click event on a action button for plugin.
	 *
	 * @param {Object} plugin The plugin that was clicked.
	 */
	const handlePluginActionClick = (plugin) => {
		installActivatePlugin(plugin);
	};

	if (isLoading || error) {
		return <PageBody>{isLoading ? <Loading /> : <Alert type="error">{parseErrorResponse(error)}</Alert>}</PageBody>;
	}

	return (
		<PageBody>
			{installResult.isError && (
				<Alert className="mb-4" type="error">
					{parseErrorResponse(installResult.error)}
				</Alert>
			)}
			<WhiteBox className="!flex-row mb-4">
				<div className="flex-grow">
					<p className="mb-5 text-lg font-bold leading-6 text-primaryText">
						{__(
							'When we started Comment Converter, we had one goal in mind: to help small businesses grow and compete with the big guys.',
							'subscribe-to-comment-notifications-comment-converter'
						)}
					</p>
					<p className="mb-5 text-base font-normal leading-6 text-primaryText100">
						{__(
							'We were tired of seeing only the companies with the deepest pockets get access to quality lead generation software to grow their list, leads and sales. So we set out to create a best-in-class tool at a price even small businesses could afford.',
							'subscribe-to-comment-notifications-comment-converter'
						)}
					</p>
					<p className="mb-5 text-base font-normal leading-6 text-primaryText100">
						{__(
							'With decades of experience building community online, we understand that someone leaving a comment on your blog is one of your MOST engaged visitors… and yet, most websites do nothing to harness the power of that moment.',
							'subscribe-to-comment-notifications-comment-converter'
						)}
					</p>
					<p className="mb-5 text-base font-normal leading-6 text-primaryText100">
						{__(
							'With Comment Converter, you now can!',
							'subscribe-to-comment-notifications-comment-converter'
						)}
					</p>
					<p className="mb-5 text-base font-normal leading-6 text-primaryText100">
						{__(
							'From the blogger just getting started or small independent local businesses, to growing eCommerce stores and even Fortune 500 companies… we help the most reputable brands online make targeted offers to the right person, at the right time.',
							'subscribe-to-comment-notifications-comment-converter'
						)}
					</p>
					<p className="mb-5 text-base font-normal leading-6 text-primaryText100">
						{__(
							'Thank you for the opportunity to help you win and win more often!',
							'subscribe-to-comment-notifications-comment-converter'
						)}
					</p>
				</div>
				<div className="ml-[54px] rtl:!ml-0 rtl:mr-[54px] flex flex-col max-w-[400px]">
					<img
						src={urls.assets('images/cc-team.jpg')}
						alt={
							// translators: Comment Converter is the name of the plugin.
							__('The Comment Converter Team', 'subscribe-to-comment-notifications-comment-converter')
						}
					/>
					<div className="text-sm text-primaryText75 mt-[6px] text-center">
						{/* translators: Comment Converter is the name of the plugin. */}
						{__('Comment Converter Team', 'subscribe-to-comment-notifications-comment-converter')}
					</div>
				</div>
			</WhiteBox>
			<div className="inline-flex flex-wrap gap-4">
				{amPlugins.map((plugin) => {
					const statusClasses = classNames('font-bold text-sm', {
						'text-primaryText': !plugin.installed,
						'text-primaryRed': plugin.installed && !plugin.active,
						'text-primaryGreen': plugin.active,
					});

					let actionButtonText = __('Activated', 'subscribe-to-comment-notifications-comment-converter');
					if (!plugin.active) {
						actionButtonText = __(
							'Activate Plugin',
							'subscribe-to-comment-notifications-comment-converter'
						);

						if (plugin.updating) {
							actionButtonText = __(
								'Activating…',
								'subscribe-to-comment-notifications-comment-converter'
							);
						}

						if (!plugin.installed) {
							actionButtonText = __(
								'Install Plugin',
								'subscribe-to-comment-notifications-comment-converter'
							);

							if (plugin.updating) {
								actionButtonText = __(
									'Installing…',
									'subscribe-to-comment-notifications-comment-converter'
								);
							}
						}
					}

					return (
						<ShadowBox className="bg-white basis-1/2 max-w-[calc(50%-8px)]" key={plugin.id}>
							<div className="border-b border-neutral40 grow flex py-6 px-[30px] w-full">
								<div>
									<img
										className="max-w-[50px] mr-[30px] rtl:!mr-0 rtl:ml-[30px]"
										src={plugin.icon}
										alt={plugin.name}
									/>
								</div>
								<div className="flex flex-col">
									<span className="font-bold text-base text-primaryText mb-2.5">{plugin.name}</span>
									<span className="text-primaryText100 text-sm leading-[21px]">{plugin.desc}</span>
								</div>
							</div>
							<div className="flex items-center justify-between py-4 px-[30px] w-full">
								<div>
									<span className="text-sm text-primaryText100 mr-2.5 rtl:!mr-0 rtl:ml-2.5">
										{__('Status', 'subscribe-to-comment-notifications-comment-converter')}:
									</span>
									<span className={statusClasses}>{plugin.status}</span>
								</div>
								<div>
									{!plugin.installed || !plugin.active ? (
										<PrimaryButton size="small" onClick={() => handlePluginActionClick(plugin)}>
											{actionButtonText}
										</PrimaryButton>
									) : (
										<SecondaryButton size="small">{actionButtonText}</SecondaryButton>
									)}
								</div>
							</div>
						</ShadowBox>
					);
				})}
			</div>
		</PageBody>
	);
};
