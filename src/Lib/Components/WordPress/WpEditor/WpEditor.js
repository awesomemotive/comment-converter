import { useEffect } from '@wordpress/element';
import classNames from 'classnames';

/**
 * @param props
 * @see https://make.wordpress.org/core/2017/05/20/editor-api-changes-in-4-8/
 * @see wp-admin/js/editor.js
 */
export function WpEditor(props) {
	const { className, settings, onChange, ...rest } = props;

	const classes = classNames('WpEditor', className);

	useEffect(() => {
		/**
		 * Hooks up the 'change' event listener for the WordPress editor with the onChange callback.
		 *
		 * @param {Event}  event  - The event.
		 * @param {Object} editor - The WordPress editor instance.
		 */
		const setupOnChange = (event, editor) => {
			if (editor.id !== props.id) {
				return;
			}
			editor.on('change', () => {
				const content = editor.getContent();

				onChange(content, props.name);
			});
		};

		// We must use jQuery in here. addEventListener doesn't work.
		jQuery(document).on('tinymce-editor-init', setupOnChange);

		return () => {
			jQuery(document).off('tinymce-editor-init', setupOnChange);
		};
	}, []);

	useEffect(() => {
		wp.editor.initialize(props.id, settings);

		return () => {
			wp.editor.remove(props.id);
		};
	}, []);

	/**
	 * Handles the change event for the WordPress editor.
	 *
	 * @param {Event} event - The change event.
	 */
	const handleChange = (event) => {
		const { value } = event.target;

		onChange(value, props.name);
	};

	return (
		<div className={classes}>
			<textarea {...rest} onChange={handleChange} />
		</div>
	);
}
