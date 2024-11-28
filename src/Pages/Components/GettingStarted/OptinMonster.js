import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Features } from './Features';
import { PrimaryButton, TextLink } from '../../../Common/Buttons/BaseButton';
import { optinmonsterFeatures } from './featuresData';
import { useGetAMPluginsQuery, useUpdateAMPluginsMutation } from '../../../store/localApi';
import { Alert } from '../../../Common/Alert/Alert';
import { parseErrorResponse } from '../../../utils/error';
import { usePrevious } from '../../../Lib/hooks/usePrevious';

export const OptinMonster = () => {
	const { data: amPlugins, error, isLoading } = useGetAMPluginsQuery();
	const wasLoadingFirstTime = usePrevious(isLoading);

	const [activeFromTheStart, setActiveFromTheStart] = useState(null);
	const [fetchingError, setFetchingError] = useState(null);

	const omPlugin = useMemo(() => (amPlugins || []).find((plugin) => plugin.slug === 'optinmonster'), [amPlugins]);

	const [installActivatePlugin, installResult] = useUpdateAMPluginsMutation();

	useEffect(() => {
		if (wasLoadingFirstTime && !isLoading && error) {
			setFetchingError(error);
		}
	}, [error, isLoading, wasLoadingFirstTime]);

	useEffect(() => {
		if (omPlugin && null === activeFromTheStart) {
			setActiveFromTheStart(omPlugin.active);
		}
	}, [activeFromTheStart, omPlugin]);

	// If we're still loading or there was an error, don't show anything.
	if (isLoading || fetchingError || !omPlugin) {
		return null;
	}

	// No need to showcase OptinMonster if it was already installed and active.
	if (omPlugin && activeFromTheStart) {
		return null;
	}

	/**
	 * Handles the click event on a action button for plugin.
	 */
	const handlePluginActionClick = () => {
		installActivatePlugin(omPlugin);
	};

	let actionButtonText = __('Activated', 'comment-notifications');
	if (!omPlugin.active) {
		actionButtonText = __('Activate Plugin', 'comment-notifications');

		if (omPlugin.updating) {
			actionButtonText = __('Activating…', 'comment-notifications');
		}

		if (!omPlugin.installed) {
			actionButtonText = __('Install Plugin', 'comment-notifications');

			if (omPlugin.updating) {
				actionButtonText = __('Installing…', 'comment-notifications');
			}
		}
	}

	return (
		<Features
			itemClassName="mb-6"
			features={optinmonsterFeatures}
			ctaButton={
				<>
					<div className="flex flex-col">
						<PrimaryButton size="xlarge" onClick={handlePluginActionClick}>{actionButtonText}</PrimaryButton>
						{installResult.isError && (
							<Alert className="mt-4" type="error">
								{parseErrorResponse(installResult.error)}
							</Alert>
						)}
					</div>
				</>
			}
			ctaExtra={<TextLink size="small" href="https://optinmonster.com" target="_blank" rel="noopener noreferrer">{__('Learn More', 'comment-notifications')}</TextLink>}
			subtitle={
				<>
					{__(
						'Get OptinMonster To Boost Your Email List Growth Even More!',
						'comment-notifications'
					)}
					{__(
						'The Most Powerful Lead Generation and Customer Acquisition Software … Without the High Costs',
						'comment-notifications'
					)}
				</>
			}
			title={__('OptinMonster', 'comment-notifications')}
		/>
	);
};
