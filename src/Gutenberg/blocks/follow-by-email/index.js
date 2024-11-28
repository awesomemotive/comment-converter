import { registerBlockType } from '@wordpress/blocks';
import WhiteLogo from '../../../../assets/logos/comment-converter-white-logomark.svg';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType(metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	/**
	 * @see ./save.js
	 */
	save,

	// Add icon as an img tag as the SVG itself was having issues with scaling.
	icon: <img src={WhiteLogo} />,
});
