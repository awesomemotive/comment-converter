import { __ } from '@wordpress/i18n';
import { Welcome } from './Components/GettingStarted/Welcome';
import { Features } from './Components/GettingStarted/Features';
import { Upgrade } from './Components/GettingStarted/Upgrade';
import { SecondaryButton } from '../Common/Buttons/BaseButton';
import { comingSoonFeatures, proFeatures } from './Components/GettingStarted/featuresData';
import { PageBody } from '../Common/Layout/PageBody';
import * as urls from '../utils/urls';
import { OptinMonster } from './Components/GettingStarted/OptinMonster';

export const GettingStarted = () => {
	return (
		<PageBody>
			<div className="flex flex-col m-auto w-[900px]">
				<div className="w-full mb-6">
					<Welcome />
				</div>

				<div className="w-full mb-6">
					<Features
						features={comingSoonFeatures}
						ctaButton={
							<SecondaryButton as="a" size="xlarge" href={urls.marketing('features')} target="_blank">
								{__('See All Features', 'comment-notifications')}
							</SecondaryButton>
						}
						subtitle={
							<>
								{__(
									'We’re making comments cool again with all these solutions for growing your community…',
									'comment-notifications'
								)}
								<br />
								{__(
									'and even more coming soon in Comment Converter Pro!',
									'comment-notifications'
								)}
							</>
						}
						title={
							<>
								{__('Coming Soon Features', 'comment-notifications')}
							</>
						}
					/>
				</div>

				<div className="w-full mb-6">
					<Upgrade
						title={__('Upgrade to Pro', 'comment-notifications')}
						features={proFeatures.map((f) => f.title)}
					/>
				</div>

				<div className="w-full mb-6">
					<OptinMonster />
				</div>
			</div>
		</PageBody>
	);
};
