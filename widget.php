<?php

/**
 * Output After Content Widget Area on Frontpage
 */
function frontpage_after_content_widget( $content ) {
    if ( is_front_page() && is_active_sidebar( 'after-content' ) ) {
        ob_start();
        dynamic_sidebar( 'after-content' );
        $sidebar = ob_get_contents();
        ob_end_clean();
        $content = $content . $sidebar;
    }
    return $content;
}
add_filter( 'the_content', 'frontpage_after_content_widget' );


/**
 * Register Questionnaries widget
 */
function finance_questionnaries_widget_init() {
    // Register After Content Widget Area
    register_sidebar(
        array(
            'id' => 'after-content',
            'name' => 'Frontpage After Content',
            'description' => 'Add widgets here to appear in your Frontpage after the content.',
            'before_widget' => '<div id="%1$s" class="side widget %2$s">',
            'after_widget' => '</div>',
            'before_title' => '<h3 class="widget-title">',
            'after_title' => '</h3>'
        )
    );
    // Register Widget
    register_widget('finance_questionnaries_Widget');
}
add_action('widgets_init', 'finance_questionnaries_widget_init');


/**
 * Widget declaration
 */
class finance_questionnaries_Widget extends WP_Widget {

    function __construct() {
        $widget_options = array(
            'classname' => 'finance-questionnaries', //CSS
            'description' => 'Show a questionnaries list'
        );
        parent::__construct('finance_questionnaries', 'Finance Questionnaries', $widget_options);
    }

    /**
     * show widget form in Appearence / Widgets
     */
    function form($instance) {
        $defaults = array('title' => 'Finance Questionnaries');
        $instance = wp_parse_args( (array) $instance, $defaults);

        $title = esc_attr($instance['title']);

        echo '<p>Title <input type="text" class="widefat" name="'.$this->get_field_name('title').'" value="'.$title.'" /></p>';
    }

    /**
     * save widget form
     */
    function update($new_instance, $old_instance) {
        $instance = $old_instance;
        $instance['title'] = strip_tags($new_instance['title']);
        return $instance;
    }

    /**
     * show widget in post / page
     */
    function widget($args, $instance) {
        extract( $args ); // make arguments available as variables
        $title = apply_filters('widget_title', $instance['title']);

        echo $before_widget;
//        echo $before_title.$title.$after_title;

        //print widget content
        echo "<div id='qfp-app'>
                <div id='questionnaire-wrapper'>
                    <questionnaire-widget></questionnaire-widget>
                </div>
              </div>";

        echo $after_widget;
    }
}