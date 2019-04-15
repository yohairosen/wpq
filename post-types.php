<?php

/**
 * Creating the CPT for Finance Products
 */
function finproduct_post_type()
{

    $labels = array(
        'name' => _x('Product types', 'Post Type General Name', 'finance-questionnaire'),
        'singular_name' => _x('Product', 'Post Type Singular Name', 'finance-questionnaire'),
        'menu_name' => __('Product types', 'finance-questionnaire'),
        'parent_item_colon' => __('Parent Product', 'finance-questionnaire'),
        'all_items' => __('All Product types', 'finance-questionnaire'),
        'view_item' => __('View Product', 'finance-questionnaire'),
        'add_new_item' => __('Add New Product', 'finance-questionnaire'),
        'add_new' => __('Add New', 'finance-questionnaire'),
        'edit_item' => __('Edit Product', 'finance-questionnaire'),
        'update_item' => __('Update Product', 'finance-questionnaire'),
        'search_items' => __('Search Product types', 'finance-questionnaire'),
        'not_found' => __('Not Found', 'finance-questionnaire'),
        'not_found_in_trash' => __('Not found in Trash', 'finance-questionnaire'),
    );

    $args = array(
        'label' => __('Finance product types', 'finance-questionnaire'),
        'description' => __('Finance Product types', 'finance-questionnaire'),
        'labels' => $labels,
        // Features this CPT supports in Post Editor
        'supports' => array('title', /*'editor', */'thumbnail', 'revisions', 'custom-fields'), // comment 'editor', to disable Gutenberg editor
//        'taxonomies' => array('product-categories'),
        'show_in_rest' => true,
        'hierarchical' => false,
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_nav_menus' => true,
        'show_in_admin_bar' => true,
        'menu_position' => 5,
        'can_export' => true,
        'has_archive' => false,
        'exclude_from_search' => true,
        'publicly_queryable' => true,
        'capability_type' => 'page',
        'menu_icon' => 'dashicons-portfolio'
    );

    register_post_type('finproducts', $args);

}

add_action('init', 'finproduct_post_type', 0);


/**
 * Creating the CPT for Questionnairies
 */
function questionnaire_post_type()
{

    $labels = array(
        'name' => _x('Questionnairies', 'Post Type General Name', 'finance-questionnaire'),
        'singular_name' => _x('Questionnaire', 'Post Type Singular Name', 'finance-questionnaire'),
        'menu_name' => __('Questionnairies', 'finance-questionnaire'),
        'parent_item_colon' => __('Parent Questionnaire', 'finance-questionnaire'),
        'all_items' => __('All Questionnairies', 'finance-questionnaire'),
        'view_item' => __('View Questionnaire', 'finance-questionnaire'),
        'add_new_item' => __('Add New Questionnaire', 'finance-questionnaire'),
        'add_new' => __('Add New', 'finance-questionnaire'),
        'edit_item' => __('Edit Questionnaire', 'finance-questionnaire'),
        'update_item' => __('Update Questionnaire', 'finance-questionnaire'),
        'search_items' => __('Search Questionnairies', 'finance-questionnaire'),
        'not_found' => __('Not Found', 'finance-questionnaire'),
        'not_found_in_trash' => __('Not found in Trash', 'finance-questionnaire'),
    );

    $args = array(
        'label' => __('Questionnairies', 'finance-questionnaire'),
        'description' => __('Finance Questionnairies', 'finance-questionnaire'),
        'labels' => $labels,
        // Features this CPT supports in Post Editor
        'supports' => array('title', 'thumbnail', 'revisions', 'custom-fields'),
        'show_in_rest' => true,
        'hierarchical' => false,
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_nav_menus' => true,
        'show_in_admin_bar' => true,
        'menu_position' => 6,
        'can_export' => true,
        'has_archive' => false,
        'exclude_from_search' => true,
        'publicly_queryable' => true,
        'capability_type' => 'page',
        'menu_icon' => 'dashicons-editor-help'
    );

    register_post_type('questionnairies', $args);

}

add_action('init', 'questionnaire_post_type', 0);


add_action('admin_enqueue_scripts', 'toplevel_page_game_test_stylesheet');
function toplevel_page_game_test_stylesheet()
{
    $custom_css = "
        #adminmenu .menu-icon-finproducts div.wp-menu-image:before,
        #adminmenu .menu-icon-questionnairies div.wp-menu-image:before {
            color: #FDF168;
        }
        #acf_after_title-sortables .acf-field-repeater.finproduct .acf-row td {
            border-bottom: 10px solid #e5e5e5;
        }
        #acf_after_title-sortables input[type=number]::-webkit-inner-spin-button, 
        #acf_after_title-sortables input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
        }
    ";
    wp_add_inline_style('wp-admin', $custom_css);
}



// REST API CUSTOMIZATIONS

/**
 * LOOP THROUGH POST TYPES AND ADD ACF FIELDS TO API
 */
add_action('rest_api_init', 'acf2api_hook_all_post_types', 99);
function acf2api_hook_all_post_types()
{
    global $wp_post_types;
    $post_types = array_keys($wp_post_types);
    foreach ($post_types as $post_type) {

        add_filter('rest_prepare_' . $post_type, function ($data, $post, $request) {

            $response_data = $data->get_data();
            if ($request['context'] !== 'view' || is_wp_error($data)) {
                return $data;
            }
            $fields = get_fields($post->ID);
            if ($fields) {
                foreach ($fields as $field_name => $value) {
                    //Set the meta
                    $response_data[$field_name] = $value;
                }
            }
            if (has_post_thumbnail()) {
                $response_data['thumbnail'] = get_the_post_thumbnail_url($post, 'organization-thumb');
                $response_data['post_thumb'] = get_the_post_thumbnail_url($post, 'post-thumb');
            }
            $response_data['post_date'] = date_format(date_create($response_data['date']), 'd M, Y');
            $response_data['posts_total_count'] = getPostTypeCountFiltered($post->post_type, $_GET);
            if($post->post_type == 'questionnairies'){
                $response_data['buttons_number'] = get_option('finance_questionnaire_number_of_buttons');
            }
            $data->set_data($response_data);
            return $data;
        }, 10, 3);
    }
}


function getPostTypeCountFiltered($post_type, $get)
{
    //Count unfiltered posts
    if (empty($get['category']) && empty($get['keyword'])) return wp_count_posts($post_type)->publish;

    //Count filtered posts

    $args = array(
        'post_type' => [$post_type],
        'posts_per_page' => -1,
        //'orderby' => ['type' => 'DESC', 'ID' => 'ASC']
    );


    if (!empty($get['keyword'])) {
        $args['s'] = $get['keyword'];
    }

    if (!empty($get['category'])) {
        $args['tax_query'][] = array(
            'taxonomy' => 'category',
            'field' => 'term_id',
            'terms' => explode(',', $get['category'])
        );
    }

    $loop = new WP_Query($args);
    wp_reset_query();

    return $loop->post_count;
}



function product_add_fields() {

    global $post;

    $currentProductTypeId = $_GET["post"];

    $query = new WP_Query(array(
        'post_type' => 'questionnairies',
        'posts_per_page' => -1,
    ));
    $questionaires = $query->posts;
    wp_reset_query();

    $fieldGroups = [];
    foreach ($questionaires as $questionaire) {


        $productTypeId = get_field('products_type', $questionaire->ID);
        if(!empty($currentProductTypeId) && $currentProductTypeId != $productTypeId ) continue; // resolve only questionairy for the selected product type

        if ($productTypeId) {
            $questions = get_fields($questionaire->ID);
            $fieldGroups[$questionaire->ID]['location'] [] = array(
                array(
                    'param' => 'post',
                    'operator' => '==',
                    'value' => $productTypeId,
                ),
            );
            if (!empty($fieldGroups[$questionaire->ID]['subfields'])) return;

            $fieldGroups[$questionaire->ID]['subfields'] = array(
                array(
                    'key' => 'field_finproducts_rank',
                    'label' => 'Rank – Lowest to Highest',
                    'name' => 'rank',
                    'type' => 'number',
                    'instructions' => '',
                    'required' => 1,
                    'conditional_logic' => 0,
                    'wrapper' => array(
                        'width' => '',
                        'class' => '',
                        'id' => '',
                    ),
                    'default_value' => '',
                    'placeholder' => '',
                    'prepend' => '',
                    'append' => '',
                    'min' => '',
                    'max' => '',
                    'step' => 0,
                ),
                array(
                    'key' => 'field_finproducts_description',
                    'label' => 'Description',
                    'name' => 'description',
                    'type' => 'wysiwyg',
                    'instructions' => '',
                    'required' => 0,
                    'conditional_logic' => 0,
                    'wrapper' => array(
                        'width' => '',
                        'class' => '',
                        'id' => '',
                    ),
                    'default_value' => '',
                    'tabs' => 'all',
                    'toolbar' => 'basic',
                    'media_upload' => 1,
                    'delay' => 0,
                ),
            );
            foreach ($questions['question'] as $question) {
                $fieldName = strtolower(str_replace(' ', '_', $question['field']));

                switch ($question['type']) {
                    case 'multiple: multiple choice':

                        $options = [];
                        foreach ($question['multiple_choice'] as $option) {
                            $options[$option['option']] = $option['option'];
                        }

                        $fieldGroups[$questionaire->ID]['subfields'][] = array(
                            'key' => 'field_finproducts_' . $fieldName,
                            'label' => $question['field'],
                            'name' => $fieldName,
                            'type' => 'select',
                            'instructions' => '',
                            'required' => 0,
                            'conditional_logic' => 0,
                            'wrapper' => array(
                                'width' => '',
                                'class' => '',
                                'id' => '',
                            ),
                            'choices' => $options,
                            'default_value' => array(),
                            'allow_null' => 0,
                            'multiple' => 1,
                            'ui' => 1,
                            'ajax' => 0,
                            'return_format' => 'value',
                            'placeholder' => '',
                        );
                        break;
                    case 'single: single choice':
                        $options = [];
                        foreach ($question['single_choise'] as $option) {
                            $options[$option['option']] = $option['option'];
                        }
                        $fieldGroups[$questionaire->ID]['subfields'][] = array(
                            'key' => 'field_finproducts_' . $fieldName,
                            'label' => $question['field'],
                            'name' => $fieldName,
                            'type' => 'select',
                            'instructions' => '',
                            'required' => 0,
                            'conditional_logic' => 0,
                            'wrapper' => array(
                                'width' => '',
                                'class' => '',
                                'id' => '',
                            ),
                            'choices' => $options,
                            'default_value' => array(),
                            'allow_null' => 0,
                            'multiple' => 1,
                            'ui' => 1,
                            'ajax' => 0,
                            'return_format' => 'value',
                            'placeholder' => '',
                        );
                        break;
                    case 'boolean: yes/no':
                        $fieldGroups[$questionaire->ID]['subfields'][] = array(
                            'key' => 'field_finproducts_' . $fieldName,
                            'label' => $question['field'],
                            'name' => $fieldName,
                            'type' => 'true_false',
                            'instructions' => '',
                            'required' => 0,
                            'conditional_logic' => 0,
                            'wrapper' => array(
                                'width' => '',
                                'class' => '',
                                'id' => '',
                            ),
                            'message' => '',
                            'default_value' => 0,
                            'ui' => 1,
                            'ui_on_text' => '',
                            'ui_off_text'
                        );
                        break;
                    case 'scale: min and max labels can be configured':
                        $fieldGroups[$questionaire->ID]['subfields'][] = array(
                            'key' => 'field_finproducts_' . $fieldName,
                            'label' => $question['field'],
                            'name' => $fieldName,
                            'type' => 'number',
                            'instructions' => '',
                            'required' => 1,
                            'conditional_logic' => 0,
                            'wrapper' => array(
                                'width' => '',
                                'class' => '',
                                'id' => '',
                            ),
                            'default_value' => '',
                            'placeholder' => '',
                            'prepend' => '',
                            'append' => '',
                            'min' => $question['scale']['min'],
                            'max' => $question['scale']['max'],
                            'step' => $question['scale']['step']
                        );
                        break;
                }
            }
        }
    }

    foreach ($fieldGroups as $questionaireId => $fieldGroup) {


        $fields = array(
            'key' => 'group_finproducts_parameters_' . $questionaireId,
            'title' => 'Parameters',
            'fields' => array(
                array(
                    'key' => 'field_finproducts_repeater_' . $questionaireId,
                    'label' => 'Product',
                    'name' => 'product',
                    'type' => 'repeater',
                    'instructions' => '',
                    'required' => 0,
                    'conditional_logic' => 0,
                    'wrapper' => array(
                        'width' => '',
                        'class' => 'finproduct',
                        'id' => '',
                    ),
                    'collapsed' => '',
                    'min' => 0,
                    'max' => 0,
                    'layout' => 'block',
                    'button_label' => 'Add Brand',
                    'sub_fields' => $fieldGroup['subfields']
                ),
            ),
            'location' => $fieldGroup['location'],
            'menu_order' => 0,
            'position' => 'acf_after_title',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen' => '',
            'active' => 1,
            'description' => '',

        );

        acf_add_local_field_group($fields);

    }

}

add_action('acf/init', 'product_add_fields');


/**
 * Show columns in the questionnaries list
 */
add_filter('manage_questionnairies_posts_columns', 'questionnairies_columns_head');
function questionnairies_columns_head( $columns ) {
    $columns = array(
        'cb' => $columns['cb'],
        'title' => __( 'Title' ),
        'products_type' => __( 'Product type' ),
        'shortcode' => __( 'Shortcode'),
        'date' => __( 'Date'),
    );
    return $columns;
}

add_action( 'manage_questionnairies_posts_custom_column', 'questionnairies_columns_body', 10, 2);
function questionnairies_columns_body( $column, $post_id ) {
    if ( $column == 'shortcode' ) {
        echo  "[questionnaire id='$post_id']" ;
    }
    else if ( $column == 'products_type' ) {
        $productTypeId = get_field('products_type', $post_id);
        $productsType = get_post($productTypeId);
        echo  $productsType->post_title;
    }
}


/**
 * Show columns in the products types list
 */
add_filter('manage_finproducts_posts_columns', 'finproducts_columns_head');
function finproducts_columns_head( $columns ){
    $columns = array(
        'cb' => $columns['cb'],
        'title' => __( 'Title' ),
        'questionnaire' => __( 'Questionnaire'),
        'date' => __( 'Date'),
    );
    return $columns;
}

add_action( 'manage_finproducts_posts_custom_column', 'finproducts_columns_body', 10, 2);
function finproducts_columns_body( $column, $post_id ) {
    if ( $column == 'questionnaire' ) {
        $posts = get_posts( array(
            'numberposts' => 1,
            'orderby'     => 'date',
            'order'       => 'DESC',
            'include'     => array(),
            'exclude'     => array(),
            'meta_key'    => 'products_type',
            'meta_value'  => $post_id,
            'post_type'   => 'questionnairies',
//            'suppress_filters' => true,
        ) );
        echo  !empty($posts[0]) ? $posts[0]->post_title: '';
        wp_reset_postdata();
    }
}
