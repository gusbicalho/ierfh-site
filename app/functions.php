<?php

function my_scripts() {
	wp_enqueue_script(
		'bundle',
		get_stylesheet_directory_uri() . '/bundle.js'
	);
	wp_enqueue_script(
		'ui-router',
		get_stylesheet_directory_uri() . '/assets/vendor/ui-bootstrap-tpls-0.13.0.min.js'
	);
	wp_localize_script(
		'bundle',
		'ierfhLocalized',
		array(
			'assets' => trailingslashit( get_template_directory_uri() ) . 'assets'
			)
	);
}

add_action( 'wp_enqueue_scripts', 'my_scripts' );
// hide the admin bar
add_filter('show_admin_bar', '__return_false');
