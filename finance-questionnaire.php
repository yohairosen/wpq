<?php
/*
Plugin Name: Finance questionnaire
Plugin URI:
Description: Helps with the finance products fitting
Version: 1.0
Author: Klim Trakht
Author URI:
License: Private
*/

define('FQP_PATH', plugin_dir_url(__FILE__));
define('FQP_FRONT_APP_PATH', FQP_PATH . 'front-app/dist');
define('FQP_SYSTEM_PATH', __DIR__);
define('FQP_SYSTEM_FRONT_APP_PATH', FQP_SYSTEM_PATH . '/front-app/dist');

// Require ACF plugin
define('ACF_LITE', FALSE);
define("OPTIONS_ICON", 'dashicons-admin-settings');
require_once('advanced-custom-fields-pro/acf.php');


// Create custom post types
require_once('post-types.php');
require_once('custom-fields.php');
require_once('widget.php');
require_once('shortcode.php');


/**
 * Frontend
 */
// Enqueue styles and js
function enqueue_assets() {
    $dirJS = new DirectoryIterator(FQP_SYSTEM_FRONT_APP_PATH );
    $dirCSS = new DirectoryIterator(FQP_SYSTEM_FRONT_APP_PATH );

    foreach ($dirJS as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'js') {
            $fullName = basename($file);
            if(!mb_strpos($fullName, 'hot-update') && !mb_strpos($fullName, 'legacy')) {
                wp_enqueue_script($fullName, FQP_FRONT_APP_PATH. '/' . $fullName, false, '1.0.0', TRUE);
            }
        }
    }

    foreach ($dirCSS as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'css') {
            $fullName = basename($file);
            wp_enqueue_style($fullName, FQP_FRONT_APP_PATH . '/' . $fullName);
        }
    }
}
add_action( 'wp_enqueue_scripts', 'enqueue_assets' );


/**
 * Admin Enqueue js *
 */
/*function admin_queue( $hook ) {
    global $post;

    if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
        if ( 'finproducts' === $post->post_type ) {
            wp_enqueue_script( 'admin.js', FQP_PATH . '/admin.js', 'jquery', '', true );
        }
    }
}
add_action( 'admin_enqueue_scripts', 'admin_queue' );*/


/**
 * Show admin settings link in plugins list
 */
function finance_questionnaire_settings ( $links ) {
    $mylinks = array(
        '<a href="' . admin_url( 'options-general.php?page=finance-questionnaire' ) . '">Settings</a>',
    );
    return array_merge( $links, $mylinks );
}
add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), 'finance_questionnaire_settings' );


/**
 * Add admin settings
 */
add_action('admin_menu', 'finance_questionnaire_menu' );

/**
 * Add menu to admin
 */
function finance_questionnaire_menu(){
    add_options_page( 'Finance Questionnaire Options', 'Finance Questionnaire', 'manage_options', 'finance-questionnaire', 'finance_questionnaire_options' );
}

/**
 * Add fields to the admin page
 */
add_action('admin_init', 'finance_questionnaire_admin_init');

/**
 * Add plugin admin settings
 */
function finance_questionnaire_admin_init() {
    register_setting('widget-settings-group', 'finance_questionnaire_number_of_buttons');
}

/**
 * Show admin settings page
 */
function finance_questionnaire_options() {
    $number_of_buttons_default_value = !empty(get_option('finance_questionnaire_number_of_buttons')) ? get_option('finance_questionnaire_number_of_buttons') : 0;
    ?>
    <div class="wrap">
        <h2>Finance Questionnaire</h2>
        <form action="options.php" method="post">
            <?php settings_fields('widget-settings-group'); ?>
            <?php do_settings_sections('widget-settings-group'); ?>

            <table class="form-table">
                <tr valign="top">
                    <th scope="row"><label for="finance_questionnaire_number_of_buttons">Number of buttons to show in widget</label></th>
                    <td>
                        <input type="text" name="finance_questionnaire_number_of_buttons" id="finance_questionnaire_number_of_buttons" value="<?php echo $number_of_buttons_default_value; ?>" />
                    </td>
                </tr>
            </table> <?php @submit_button(); ?>
        </form>
    </div>
    <?php
}


/**
 * Remove metaboxes from other plugins
 */
function my_remove_meta_boxes()
{
    if (is_admin()) {
        remove_meta_box('theme_settings_metabox', 'finproducts', 'normal');
        remove_meta_box('theme_settings_metabox', 'questionnairies', 'normal');
    }
}
add_action( 'admin_menu', 'my_remove_meta_boxes' );

/** Remove Genesis inpost layouts from 'product' post_type */
add_action( 'init', 'child_remove_post_type_support' );
function child_remove_post_type_support() {
    remove_post_type_support( 'product', 'genesis-layouts' );
}