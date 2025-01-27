import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	return (
		<p {...useBlockProps()}>
			<InspectorControls>
				<PanelBody>
					<TextControl
						label={__('TEXT', 'subscribe-to-comment-notifications-comment-converter')}
						onChange={(val) => setAttributes({ text: val })}
						value={attributes.text}
					/>
				</PanelBody>
			</InspectorControls>
			<RichText
				tagName="a" // The tag here is the element output and editable in the admin
				value={attributes.text} // Any existing content, either from the database or an attribute default
				allowedFormats={['core/bold', 'core/italic']} // Allow the content to be made bold or italic, but do not allow other formatting options
				onChange={(value) => setAttributes({ text: value })} // Store updated content as a block attribute
				href="#"
			/>
		</p>
	);
}
