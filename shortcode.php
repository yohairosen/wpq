<?php

/**
 * Add a post wrapper
 */
function wrap_post_content($text) {
    return is_single() ? "<div id='qfp-app'>$text</div>" : $text;
}
add_filter( 'the_content', 'wrap_post_content');


/**
 * Create shortcode fot embedded rendering
 */
function render_embedded_block($args) {
    $id = $args['id'];
    if(is_singular() || is_page()) {
        return "<div id='questionnaire-wrapper'>
                <questionnaire :id='$id' :nested='false'></questionnaire>
            </div>";
    }
}
add_shortcode('questionnaire', 'render_embedded_block');



