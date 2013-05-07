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
                if (typeof enableAnnotations == "function"){
                    enableAnnotations();
                }
            } else if (mimeType.match("xml") || mimeType.match("text")){
                var resURL;
                // if resource is plain text insert text content directly
                // if resource is xml get content via /content/raw link
                if (mimeType.match("xml")){
                    resURL = '/' + jQuery('#metadata').data('moduleprefix') + "/resources/" + existingId + "/content/raw";
                } else {
                    resURL = resURI;
                }
                // Listen for mouse up events for displaying selection word count
                jQuery('body').mouseup(function (e){
                    var selected = getSelectionText();
                    if (selected && selected.length > 0){
                        var wordCount = selected.replace(/\-+|&nbsp;/gi,' ').trim().split(/\s+/).length;
                        jQuery('#selectedWordCount').html("Selected Word Count: " + wordCount);
                    } else {
                        jQuery('#selectedWordCount').html("");
                    }
                    
                });
                jQuery.ajax({
                      type: 'GET',
                      cache: false, // FIXME: this is horrible
                      // we really do want to cache these, but for text resources either jQuery or the browser is getting confused and not sending another request to the server
                      url: resURL,
                      success: function(d){
                          var result = d;
                          if (!mimeType.match("xml")){
                              result = "<pre style='white-space:pre-wrap'>" + d + "</pre>"
                          }
                          jQuery('#resourceContent').html(result);
                          if (typeof enableAnnotations == "function"){
                              enableAnnotations();
                          }
                          var wordCount=jQuery('#resourceContent').text().replace(/\-+|&nbsp;/gi,' ').trim().split(/\s+/).length;
                          jQuery('#wordCount').html("Resource Total Word Count: " + wordCount);
                      }
                });
            }
        }
    });
    
});
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

