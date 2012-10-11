$(function () {
    'use strict';

    // Initialize the jQuery File Upload widget:
    jQuery('#fileupload').fileupload();

    // Enable iframe cross-domain access via redirect option:
    jQuery('#fileupload').fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*jQuery/,
            '/uploadtest/cors/result.html?%s'
        )
    );

        // Load existing files:
        jQuery('#fileupload').each(function () {
            var that = this;
            jQuery.getJSON(this.action, function (result) {
                if (result && result.results && result.results.length) {
                    jQuery(that).fileupload('option', 'done')
                        .call(that, null, {result: result.results});
                }
            });
        });
    

});
