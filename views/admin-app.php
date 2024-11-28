<?php
/**
 * Comment Converter Admin App.
 *
 * @package CommentConverter
 */

 // Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>

<div id="comment-converter-app" class="comment-converter-app">
	<div class="ccvtr-loading">
		<?php
			echo wp_kses(
				$data['flat_logo'] ?? '',
				array(
					'svg'   => array(
						'class'           => true,
						'aria-hidden'     => true,
						'aria-labelledby' => true,
						'role'            => true,
						'xmlns'           => true,
						'width'           => true,
						'height'          => true,
						'viewbox'         => true // <= Must be lower case!
					),
					'g'     => array(
						'fill'      => true,
						'clip-path' => true,
					),
					'title' => array( 'title' => true ),
					'path'  => array(
						'd'     => true,
						'fill'  => true,
						'id'    => true,
						'class' => true,
					),
					'defs'     => array(),
					'clipPath' => array(
						'id' => true
					),
				)
			);
		?>
	</div>
</div>
