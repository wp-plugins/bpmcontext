<?php
/*
  Plugin Name: BPMContext
  Plugin URI: https://bpmcontext.com
  Description: This plugin adds BPMContext intranet into a single page in your WordPress site. Create workspaces for sharing department policies, announcements, IT support requests and more. To get started: Click the Activate link then go to BPMContext settings page to sign up for your account.
  Version: 2.1
  Author: BPMContext
  Author URI: https://bpmcontext.com
  License: GPLv2+
  Text Domain: bpmcontext
*/

register_activation_hook(__FILE__,'bpm_activate_plugin');
register_deactivation_hook( __FILE__, 'bpm_plugin_remove' );

add_action('admin_init', 'bpm_options_init' );
add_action('admin_menu', 'bpm_options_add_page');

// Add settings link on plugin page
function bpm_settings_link($links) {
    $settings_link = '<a href="options-general.php?page=bpm_options">Settings</a>';
    array_unshift($links, $settings_link);
    return $links;
}

$plugin = plugin_basename(__FILE__);
add_filter("plugin_action_links_$plugin", 'bpm_settings_link' );

if(stristr($_SERVER['REQUEST_URI'], 'bpmcontext-dashboard')){
    add_action('wp_enqueue_scripts', 'addHeaderForBPMContext');
    add_action( 'init', 'bpm_update_theme', 1 );
    add_action( 'wp_enqueue_scripts', 'bpm_register_styles', 50 );
}

add_shortcode( 'BPMContext_Content', 'bpm_add_content_grid' );

function bpm_options_init(){
    register_setting( 'bpm_options_options', 'bpm_site_options', 'bpm_options_validate' );
}

function bpm_add_content_grid(){

    //setup html localization
    $curLang = substr(get_bloginfo( 'language' ), 0, 2);

    if(!$curLang) $curLang = 'en';

    if( !file_exists(plugin_dir_path(__FILE__) . 'html/desktop_'.$curLang.'.html') ){
        $curLang = 'en';
    }

	echo file_get_contents(plugins_url() . '/bpmcontext/html/desktop_'.$curLang.'.html');

}

// Add menu page
function bpm_options_add_page() {
	add_options_page('BPMContext', 'BPMContext', 'manage_options', 'bpm_options', 'bpm_options_do_page');
}


function bpm_get_permalink_by_slug( $slug, $post_type = '' ) {

    // Initialize the permalink value
    $permalink = null;

    // Build the arguments for WP_Query
    $args =	array(
        'name' 			=> $slug,
        'max_num_posts' => 1
    );

    // If the optional argument is set, add it to the arguments array
    if( '' != $post_type ) {
        $args = array_merge( $args, array( 'post_type' => $post_type ) );
    } // end if

    // Run the query (and reset it)
    $query = new WP_Query( $args );
    if( $query->have_posts() ) {
        $query->the_post();
        $permalink = get_the_ID();
    } // end if
    wp_reset_postdata();

    return $permalink;


}

function bpm_options_do_page() {

    remove_meta_box('linktargetdiv', 'link', 'normal');
    remove_meta_box('linkxfndiv', 'link', 'normal');
    remove_meta_box('linkadvanceddiv', 'link', 'normal');
    remove_meta_box('postexcerpt', 'post', 'normal');
    remove_meta_box('trackbacksdiv', 'post', 'normal');
    remove_meta_box('postcustom', 'post', 'normal');
    remove_meta_box('commentstatusdiv', 'post', 'normal');
    remove_meta_box('commentsdiv', 'post', 'normal');
    remove_meta_box('revisionsdiv', 'post', 'normal');
    remove_meta_box('authordiv', 'post', 'normal');
    remove_meta_box('sqpt-meta-tags', 'post', 'normal');

    bpm_register_scripts('admin');
    bpm_register_styles('admin');

    //setup html localization
    $curLang = substr(get_bloginfo( 'language' ), 0, 2);

    if(!$curLang) $curLang = 'en';

    if( !file_exists(plugin_dir_path(__FILE__) . 'html/desktop_admin_'.$curLang.'.html') ){
        $curLang = 'en';
    }

    $html_string = file_get_contents(plugins_url() . '/bpmcontext/html/desktop_admin_'.$curLang.'.html');
    echo '<div id="bpm_settings">';
    settings_fields('bpm_options_options');
    echo '</div>';

    $options = get_option('bpm_site_options');
    $theme = wp_get_theme();
    $theme_name = str_replace(' ', '_', strtolower($theme->get( 'Name' )));
    if(!$options['custom_css_'.$theme_name]) $options['custom_css_'.$theme_name] = '';
    $html_string = str_replace('CUSTOMCSSVALUE', $options['custom_css_'.$theme_name], $html_string);
    $html_string = str_replace('CUSTOMCSSNAME', 'bpm_site_options[custom_css_'.$theme_name.']', $html_string);
    $the_page = bpm_get_permalink_by_slug('bpmcontext-dashboard', 'page');
    $html_string = str_replace('BPMEDITPOST', get_edit_post_link( $the_page ), $html_string);

    echo $html_string;

}

// Sanitize and validate input. Accepts an array, return a sanitized array.
function bpm_options_validate($input) {
    $theme = wp_get_theme();
    $theme_name = str_replace(' ', '_', strtolower($theme->get( 'Name' )));

    $input['login_button_name']  =  wp_filter_nohtml_kses($input['custom_css_'.$theme_name]);

    return $input;
}

function bpm_update_theme(){
    $theme = wp_get_theme();
    $option = get_option('bpm_current_theme');
    if($option) {
        if($option <> $theme->get( 'Name' )){
            //check for full page type
            $templates = wp_get_theme()->get_page_templates();

            foreach ( $templates as $template_name => $template_filename ){
                if(stristr($template_name, 'full') && stristr($template_name, 'width')){
                    $new_template_slug = $template_name;
                }
            }
            //if full page change our page type to full page
            $the_page = bpm_get_permalink_by_slug('bpmcontext-dashboard', 'page');
            if ($the_page && $new_template_slug) {
                //change page template
                $_p = array();
                $_p['ID'] = $the_page;
                $_p['page_template'] = $new_template_slug;
                $_p['post_title'] = 'Dashboard';
                wp_update_post($_p);
            }

            //save theme name on options
            update_option( 'bpm_current_theme', $theme->get( 'Name' ) );
        }
    }else{
        //save theme name on options
        add_option( 'bpm_current_theme', $theme->get( 'Name' ),  null, 'no' );
    }
}


function addHeaderForBPMContext(){

    $admin_bar = 0;
    if ( is_admin_bar_showing() ) {
        //add space for header bar
//        $admin_bar = 1;
    }

    $curLang = substr(get_bloginfo( 'language' ), 0, 2);

    if(!$curLang) $curLang = 'en';

    if( !file_exists(plugin_dir_path(__FILE__) . 'html/desktop_admin_'.$curLang.'.html') ){
        $curLang = 'en';
    }

    $theme = wp_get_theme();

    $theme_name = str_replace(' ', '_', strtolower($theme->get( 'Name' )));
	$params = array(
		'images_dir' => plugins_url() . '/bpmcontext/images/',
        'html_dir' => plugins_url() . '/bpmcontext/html/',
        'css_dir' => plugins_url(). '/bpmcontext/css/',
        'admin_bar' => $admin_bar,
        'current_theme' => $theme_name,
        'language' => $curLang
	);

    bpm_register_scripts('intranet');

	wp_localize_script( 'js_bpmcontext', 'bpm_params', $params );

}


function bpm_register_scripts($screen_type){

    wp_deregister_script('jquery');
    wp_register_script('jquery', "http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js", array(),'2.1.0',false);
	wp_register_script('modernizer', plugins_url()."/bpmcontext/js/vendor/modernizr.js",array(),'2.7.1', false);
	wp_register_script('foundation', plugins_url() . '/bpmcontext/js/foundation.min.js',array(),'5.1.1', false);
    wp_register_script('foundation-joyride', plugins_url() . '/bpmcontext/js/foundation/foundation.joyride.js',array(),'5.1.1', false);
    wp_register_script('tree_table', plugins_url() . '/bpmcontext/js/jquery.treetable.js',array(),'4.2.4', false);
    wp_register_script('dropzone', plugins_url() . '/bpmcontext/js/dropzone.js',array(),'4.2.4', false);
    wp_register_script('tinymce_text', plugins_url() . '/bpmcontext/js/tinymce/tinymce.min.js',array(),'4.2.4', true);

	wp_register_script('js_bpmcontext', plugins_url() . '/bpmcontext/js/bpmcontext.js',array(),'2.1',true);
    wp_register_script('js_bpmcontext_left_menu', plugins_url() . '/bpmcontext/js/bpmcontext_left_menu.js',array(),'2.1',true);
    wp_register_script('js_bpmcontext_content_page', plugins_url() . '/bpmcontext/js/bpmcontext_content_page.js',array(),'2.1',true);
    wp_register_script('js_bpmcontext_toolbar', plugins_url() . '/bpmcontext/js/bpmcontext_toolbar.js',array(),'2.1',true);
    wp_register_script('js_bpmcontext_right_content', plugins_url() . '/bpmcontext/js/bpmcontext_right_content.js',array(),'2.1',true);

    wp_register_script( 'braintree', 'https://js.braintreegateway.com/v2/braintree.js');

    if($screen_type == 'admin') {
        wp_enqueue_script(array('jquery', 'modernizer', 'foundation', 'foundation-joyride','js_bpmcontext'));

        $the_page = bpm_get_permalink_by_slug('bpmcontext-dashboard', 'page');

        $templates = wp_get_theme()->get_page_templates();
        $has_full_width = 0;

        foreach ($templates as $template_name => $template_filename) {
            if (stristr($template_name, 'full') && stristr($template_name, 'width')) {
                $has_full_width = 1;
            }
        }

        $params = array(
            'images_dir' => plugins_url() . '/bpmcontext/images/',
            'html_dir' => plugins_url() . '/bpmcontext/html/',
            'css_dir' => plugins_url(). '/bpmcontext/css/',
            'login_url' => get_page_link($the_page),
            'has_full_width' => $has_full_width
        );

        bpm_register_scripts('intranet');

        wp_localize_script( 'js_bpmcontext', 'bpm_params', $params );

    }else {
        wp_enqueue_script(array('jquery', 'modernizer', 'foundation', 'foundation-joyride','tree_table', 'tinymce_text', 'braintree', 'js_bpmcontext', 'js_bpmcontext_content_page', 'js_bpmcontext_toolbar', 'js_bpmcontext_left_menu', 'js_bpmcontext_right_content'));

        wp_enqueue_script('jquery-ui-datepicker');
        wp_enqueue_script('jquery-ui-autocomplete');
        wp_enqueue_script('jquery-ui-widget');

        wp_enqueue_script(array('dropzone'));
    }
}

function bpm_register_styles($screen_type = 'intranet') {

	wp_register_style('normalize', plugins_url()."/bpmcontext/css/normalize.css",array(),'5.1.1','screen');
	wp_register_style('foundation', plugins_url()."/bpmcontext/css/foundation.css",array(),'5.1.1','screen');
	wp_register_style('icons', plugins_url()."/bpmcontext/css/foundation-icons.css",array(),'3.0.0','screen');
    wp_register_style('tree_table', plugins_url()."/bpmcontext/css/treetable/jquery.treetable.css",array(),'3.2.1','screen');
    wp_register_style('tree_table_theme', plugins_url()."/bpmcontext/css/treetable/jquery.treetable.theme.default.css",array(),'3.2.1','screen');
    wp_register_style('font-awesome', plugins_url() . '/bpmcontext/css/font-awesome.min.css', array(),'1.0.1','screen');
    wp_register_style('jquery-ui', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.13/themes/cupertino/jquery-ui.css', array(),'1.0.1','screen');
    wp_register_style('dropzone', plugins_url()."/bpmcontext/css/dropzone.css",array(),'1.0.0','screen');
    wp_register_style('css_bpmcontext', plugins_url() . '/bpmcontext/css/bpmcontext.css', array(),'2.1','screen');

    if($screen_type == 'admin') {
        wp_enqueue_style(array( 'foundation', 'icons', 'css_bpmcontext'));
        $custom_css = "
                .wp-submenu{
                        margin-left: 0 !important;
                }";
        wp_add_inline_style( 'css_bpmcontext', $custom_css );
    }else {
        wp_enqueue_style(array('normalize', 'foundation', 'icons', 'tree_table', 'tree_table_theme', 'font-awesome', 'dropzone', 'jquery-ui', 'css_bpmcontext'));
    }

    //apply theme specific styles
    $theme = wp_get_theme();
    $theme_name = str_replace(' ', '_', strtolower($theme->get( 'Name' )));

//echo $theme_name;

    if( file_exists(plugin_dir_path(__FILE__) . 'css/theme_styles/developer_theme.css') ) {
        wp_enqueue_style($theme_name, plugins_url() . '/bpmcontext/css/theme_styles/developer_theme.css');
    }else if( file_exists(plugin_dir_path(__FILE__) . 'css/theme_styles/'.$theme_name.'.css') ){
        wp_enqueue_style($theme_name, plugins_url(). '/bpmcontext/css/theme_styles/'.$theme_name.'.css');
    }else{
        wp_enqueue_style($theme_name, plugins_url(). '/bpmcontext/css/theme_styles/bpmcontext_fullwidth.css');
    }

    $options = get_option('bpm_site_options');
    $theme = wp_get_theme();
    $theme_name = str_replace(' ', '_', strtolower($theme->get( 'Name' )));
    if($options['custom_css_'.$theme_name]) {
        $custom_css = $options['custom_css_'.$theme_name];
        wp_add_inline_style('css_bpmcontext', $custom_css);
    }

}

function bpm_plugin_remove(){

    global $wpdb;

    $the_page_title = 'Dashboard';
    $the_page_name = get_option("bpmcontext-dashboard");

    //  the id of our page...
    $the_page_id = bpm_get_permalink_by_slug('bpmcontext-dashboard', 'page');

    if ($the_page_id) {
        $locations = get_theme_mods( 'nav_menu_locations' );
        $menu = wp_get_nav_menu_object( reset( $locations ) );
        $items = wp_get_nav_menu_items( $menu->term_id );
        if($items) {
            foreach ($items as $item) {
                if ($item->object_id == $the_page_id) {
                    wp_delete_nav_menu($item->ID);
                }
            }
        }

        wp_delete_post($the_page_id, true); // this will delete

    }

}



function bpm_activate_plugin(){

    $the_page = bpm_get_permalink_by_slug('bpmcontext-dashboard', 'page');

    if (!$the_page) {

        $templates = wp_get_theme()->get_page_templates();

            foreach ($templates as $template_name => $template_filename) {
                if (stristr($template_name, 'full') && stristr($template_name, 'width')) {
                    $new_template_slug = $template_name;
                }
            }

        $_p = array();
        $_p['post_name'] = 'bpmcontext-dashboard';
        $_p['post_content'] = "[BPMContext_Content]";
        $_p['post_status'] = 'publish';
        $_p['post_type'] = 'page';
        $_p['comment_status'] = 'closed';
        $_p['ping_status'] = 'closed';
        $_p['post_title'] = 'Dashboard';
        if($new_template_slug){
            $_p['page_template'] = $new_template_slug;
        }
        $_p['post_category'] = array(1);

        $the_page_id = wp_insert_post( $_p );

        $locations = get_theme_mods( 'nav_menu_locations' );
        $menu = wp_get_nav_menu_object( reset( $locations ) );
        $menu_item_data = array(
            'menu-item-object-id' => $the_page_id,
            'menu-item-parent-id' => 0,
            'menu-item-position' => 0,
            'menu-item-title' => 'Dashboard',
            'menu-item-object' => 'page',
            'menu-item-type' => 'post_type',
            'menu-item-status' => 'publish'
        );
        wp_update_nav_menu_item( $menu->term_id, 0, $menu_item_data );
    }

}
?>