/*
$( document ).ajaxSend(function( event, request, settings ) {
    console.log( "event", event );
    console.log( "request", request );
    console.log( "settings", settings );
    console.log( "Triggered ajaxComplete handler." );
});*/

jQuery(document).ready(function ($) {

    if (typeof acf == 'undefined') {
        return;
    }


    console.log('acf', acf)
    // make sure acf is loaded, it should be, but just in case

    var acf_field = acf.getField('field_finproducts_questionnair');

    acf_field.on("change ready", function (e) {

        // console.log('change ready', e);
        console.log('event');

        // bail early if no ajax
        // if (!acf.get('ajax')) return;

        // abort XHR if it's already running
        if (this.request) {
            this.request.abort();
        }

        // set the ajax action that's set up in php
        var data = {
            action: 'acf/fields/clone/query',
            key_name: acf_field.val() //The key_name needs to be the name of the parameter in your action
        }

        console.log('data', data);
        console.log(acf.prepareForAjax(data));


        this.request = $.ajax({
            url: acf.get('ajaxurl'),  // ajax url, acf already sets this
            data: acf.prepareForAjax(data), // another included acf function
            type: 'post', // posted values, look at $_POST in your php ajax action function
            dataType: 'json', // how we want the date returned
            success: function (json) {

                console.log('json', json);
                // get the field we want to populate
                var $select = $('.acf-field-56e2b71dde0c5 select');
                // this stores the currenlty selected value in that field
                // so that we can mark it as selected, this is important when loading
                // and exsiting post
                var $selected = $select.val();
                // clear all of the exsiting options from the field
                $select.empty();
                // rebuild the child select field
                $select.append('<option data-i="" selected="selected" value="">- Select -</option>');
                var count = json.length;
                for (i = 0; i < count; i++) {
                    var $item = '<option value="' + json[i]['value'] + '"'
                    if ($selected == json[i]['value']) {
                        $item += ' selected="selected"';
                    }
                    $item += '>' + json[i]['label'] + '</option>';
                    $select.append($item);
                }
            }
        }); // end ajax

    });

    // trigger the ready action to load the field
    // this is important for existing posts
    $('#acf-field_finproducts_questionnair').trigger('ready');


    /*
        // extend the acf.ajax object
        // you should probably rename this var
        var myACFextension = acf.Field.extend({
            events: {
                // this data-key must match the field key for the state field on the post page where
                // you want to dynamically load the cities when the state is changed
                'change [data-key="field_finproducts_questionnair"] select': '_state_change',
                // this entry is to cause the city field to be updated when the page is loaded
                'ready [data-key="field_finproducts_questionnair"] select': '_state_change',
            },

            // this is our function that will perform the
            // ajax request when the state value is changed
            _state_change: function(e){

                console.log('changed');

                // clear the city field options
                // the data-key is the field key of the city field on post
                var $select = $('[data-key="field_5793770922131"] select');
                $select.empty();

                // get the state selection
                var $value = e.$el.val();

                // a lot of the following code is copied directly
                // from ACF and modified for our purpose

                // I assume this tests to see if there is already a request
                // for this and cancels it if there is
                if( this.state_request) {
                    this.state_request.abort();
                }

                // I don't know exactly what it does
                // acf does it so I copied it
                var self = this,
                    data = this.o;

                // set the ajax action that's set up in php
                data.action = 'load_city_field_choices';
                // set the state value to be submitted
                data.state = $value;

                // this is another bit I'm not sure about
                // copied from ACF
                data.exists = [];

                // this the request is copied from ACF
                this.state_request = $.ajax({
                    url:		acf.get('ajaxurl'),
                    data:		acf.prepare_for_ajax(data),
                    type:		'post',
                    dataType:	'json',
                    async: true,
                    success: function(json){

                        console.log('json', json);

                        // function to update the city field choices

                        // get the city field
                        // the city field key that we want to update
                        var $select = $('[data-key="field_5793770922131"] select');

                        // add options to the city field
                        for (i=0; i<json.length; i++) {
                            var $item = '<option value="'+json[i]['value']+'">'+json[i]['label']+'</option>';
                            $select.append($item);
                        }
                    }
                });
            },
        });

        // triger the ready action on page load
        $('[data-key="field_finproducts_questionnair0"] select').trigger('ready');*/
});
