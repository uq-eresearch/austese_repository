jQuery(document).ready(function(){
    var existingId = jQuery('#metadata').data('existingid');
    // get metadata
    var resURI = '/' + jQuery('#metadata').data('modulepath') + "/api/resources/" + existingId;
    jQuery.ajax({
        type: 'GET',
        dataType: "json",
        headers: {
            'Accept': 'application/json'
        },
        url: resURI,
        success: function(resmeta){
            var mimeType = resmeta.metadata.filetype;
            // if resource is an image create image tag
            if (mimeType.match("image")) {
                jQuery('#resourceContent').html("<img alt='Image preview' class='thumbnail' src='" + resURI + "'/>");
            } else if (mimeType.match("xml") || mimeType.match("text")){
                var resURL;
                // if resource is plain text insert text content directly
                // if resource is xml get content via /content/raw link
                if (mimeType.match("xml")){
                    resURL = '/' + jQuery('#metadata').data('moduleprefix') + "/resources/" + existingId + "/content/raw";
                } else {
                    resURL = resURI;
                }
                jQuery.ajax({
                      type: 'GET',
                      url: resURL,
                      success: function(d){
                          var result = d;
                          if (!mimeType.match("xml")){
                              result = "<pre>" + d + "</pre>"
                          }
                          jQuery('#resourceContent').html(result);
                      }
                });
            }
        }
    });
    
});