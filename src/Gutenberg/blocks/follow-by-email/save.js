import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const blockProps = useBlockProps.save();

	// The p tag allows the link to sit in its own line as any other paragraph.
	return (
		<p {...blockProps}>
			<RichText.Content tagName="a" value={attributes.text} href="#" />
		</p>
	);
}
