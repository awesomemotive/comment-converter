import { BaseButton, PrimaryButton, SecondaryButton, GreyButton, IconButton, TextLinkButton } from '../BaseButton';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';
import { IconTrash } from '../../Icons';

export default {
	title: 'Common/Buttons',
	component: BaseButton,
	decorators: [withCCStyles],
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
	args: {},
};

const Template = (args) => {
	return (
		<ul className="flex flex-col gap-2 p-4">
			<li>
				<BaseButton {...args}>Base Button</BaseButton>
			</li>
			<li>
				<PrimaryButton {...args}>Primary Button</PrimaryButton>
			</li>
			<li>
				<SecondaryButton {...args}>Secondary Button</SecondaryButton>
			</li>
			<li>
				<GreyButton {...args}>Grey Button</GreyButton>
			</li>
			<li>
				<IconButton {...args}>
					<IconTrash />
				</IconButton>
			</li>
			<li>
				<TextLinkButton {...args}>Text Link Button</TextLinkButton>
			</li>
			<li>
				<TextLinkButton as={'a'} {...args}>
					Text Link
				</TextLinkButton>
			</li>
			<li>
				<TextLinkButton as={'a'} {...args}>
					<IconTrash /> Text Link with Icon
				</TextLinkButton>
			</li>
		</ul>
	);
};

export const ButtonStyles = Template.bind({});
