jQuery(document).ready(function(){
    // get metadata
    var existingId = jQuery('#metadata').data('existingid');
    var modulePrefix = jQuery('#metadata').data('moduleprefix');
    var project = jQuery('#metadata').data('project');
    var resURI = '/' + jQuery('#metadata').data('modulepath') + "/api/resources/" + existingId;

    function afterContentLoaded(){
        if (typeof wordCloud != 'undefined' && typeof wordCloud.drawWordCloud == "function"){
            wordCloud.drawWordCloud();
        } 
        if (typeof enableAnnotations == "function"){
            enableAnnotations();
        }
        var wordCount = 0;
        var normalizedText = jQuery('#resourceContent').text().replace(/\-+|&nbsp;/gi,' ').trim();
        if (normalizedText){
            wordCount=normalizedText.split(/\s+/).length;
        }
        jQuery('#wordCount').html("Resource Total Word Count: " + wordCount);
    };
    if (typeof (jQuery().popover) == 'function'){
        jQuery.ajax({
          type: 'GET',
          url: resURI,
          dataType: "json",
          headers: {
              'Accept': 'application/json'
          },
          success: function(d){
            d.projParam = (project? '?project=' + project : '');
            d.modulePrefix = modulePrefix;
                jQuery('.resource').html(getTemplate("resourceCompact")(d))
                .find('a').popover({
                    offset: 10,
                    trigger: 'manual',
                    html: true,
                    placement: 'right',
                    template: '<div class="popover" onmouseover="clearTimeout(timeoutObj);jQuery(this).mouseleave(function() {jQuery(this).hide();});"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
                }).mouseenter(function(e) {
                    jQuery(this).popover('show');
                }).mouseleave(function(e) {
                    var ref = jQuery(this);
                    timeoutObj = setTimeout(function(){
                        ref.popover('hide');
                    }, 50);
                });
          }
        });
    }

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
                jQuery('#resourceContent').html("<div id='imageHolder' class='thumbnail'><img alt='Image preview' src='" + resURI + "'/></div>");

                var imageHolder = jQuery('#resourceContent #imageHolder');
                var annoButton = jQuery('.enableAnnotations');
                function toggleAnnotations() {
                    if (annoButton.text().match('Enable')) {
                        imageHolder.panzoom('reset');
                        imageHolder.panzoom('disable');
                        enableAnnotations();
                        
                        var html = annoButton.html();
                        html = html.replace('Enable', 'Disable');
                        annoButton.html(html);
                    } else {
                        disableAnnotations();
                        imageHolder.panzoom('enable');
                        
                        var html = annoButton.html();
                        html = html.replace('Disable', 'Enable');
                        annoButton.html(html);
                    }
                }

                if (typeof enableAnnotations == "function"){
                    // enableAnnotations();
                    annoButton.show().click(toggleAnnotations);
                }

                // Enable pan and zoom
                jQuery('#panzoom-toolbar').show();
                imageHolder.panzoom({
                  $zoomIn: jQuery('#panzoom-toolbar .zoom-in'),
                  $zoomOut: jQuery('#panzoom-toolbar .zoom-out'),
                  $zoomRange: jQuery('#panzoom-toolbar .zoom-range'),
                  $reset: jQuery('#panzoom-toolbar .reset'),
                });


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
                        var wordCount = 0;
                        var normalizedText = selected.replace(/\-+|&nbsp;/gi,' ').trim();
                        if (normalizedText){
                           wordCount = normalizedText.split(/\s+/).length;
                        }
                        
                        jQuery('#selectedWordCount').html("Selected Word Count: " + wordCount);
                    } else {
                        jQuery('#selectedWordCount').html("");
                    }
                    
                });
                jQuery.ajax({
                    type:'GET',
                    cache:false,
                    url:resURI,
                    complete: function(xhr){
                        if (xhr.status != 200){
                            jQuery("#resourceContent").html("Error retrieving resource content");
                            return;
                        }
                        var content = xhr.responseText;
                        var xml = xhr.responseXML;
                        if (!xml){
                            if (mimeType.match("xml")){
                                jQuery('#alerts').append(
                                    jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button>' 
                                        + '<h4>Resource does not contain valid XML</h4>'
                                        + '<p><a href="/' + modulePrefix + '/resources/edit/' + existingId + (project? '?project=' + project : '') +'">Edit content</a> in transcription editor to view and correct errors</p>'
                                        + '</div>').alert());
                            }
                            result = "<pre style='white-space:pre-wrap'>" + content + "</pre>";
                            jQuery("#resourceContent").html(result);
                            afterContentLoaded();
                        } else {
                            jQuery.ajax({
                                url:'/sites/all/modules/austese_repository/ui/xslt/formats.xsl',
                                success: function(xsl){
                                    var result = "FALLBACK";
                                    if (window.ActiveXObject) { // IE
                                        result = xml.transformNode(xsl);
                                    } else if (document.implementation && document.implementation.createDocument){
                                        try {
                                            xsltProcessor=new XSLTProcessor();
                                            xsltProcessor.importStylesheet(xsl);
                                            result = xsltProcessor.transformToFragment(xml,document);
                                        } catch (error){
                                            result = error.message;
                                        }
                                    } 
                                    if (result == "FALLBACK"){
                                        jQuery.ajax({
                                            type: 'GET',
                                            cache: false, // FIXME: this is horrible
                                            // we really do want to cache these, but for text resources either jQuery or the browser is getting confused and not sending another request to the server
                                            url: resURL,
                                            success: function(d){
                                                jQuery('#resourceContent').html(d);
                                                afterContentLoaded();
                                            }
                                      });
                                    } else{
                                        jQuery("#resourceContent").html(result);
                                        afterContentLoaded();
                                    }
                                }
                            });
                        }
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

