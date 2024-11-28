import { WpEditor as WpEditorBase } from '../../../Lib/Components/WordPress/WpEditor/WpEditor';
import styled from 'styled-components';

const StyledWpEditorBase = styled(WpEditorBase)`
	.wp-switch-editor {
		margin: 5px 0 0 5px;
		padding: 3px 8px 4px;
	}

	textarea {
		width: 100%;
	}
`;

export function WpEditor(props) {
	return (
		<StyledWpEditorBase
			settings={{
				tinymce: {
					wpautop: false,
					toolbar1:
						'formatselect bold italic underline strikethrough bullist numlist blockquote alignleft aligncenter alignright link unlink wp_more wp_adv',
					toolbar2:
						'alignjustify hr forecolor | pastetext removeformat charmap | outdent indent | undo redo | fullscreen | wp_help',
				},
				quicktags: true,
			}}
			rows={10}
			{...props}
		/>
	);
}
