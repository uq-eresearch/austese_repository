jQuery(function(){
     editor.init();
     editor.loadResource(jQuery('#savebtn').data("resource"));
     jQuery('#savebtn').click(editor.newResourceVersion);
 });
var editor = {
 init : function(){
     editor.cm = CodeMirror.fromTextArea(document.getElementById("editor"), {
         mode: {name: "xml", alignCDATA: true},         
         lineNumbers: true
     }); 
 },
 loadResource : function(uri) {
     if (uri){
     jQuery.ajax({
             url: uri,
             context: document.body,
             success: function(data, status, xhr){
                 editor.cm.setValue(xhr.responseText);
             },
             error: function(xhr, textStatus, errorThrown){
                 console.log(errorThrown);
                 var errorMessage = errorThrown.message;
                 // truncate error message as it tends to include the entire document
                 if (textStatus == "parsererror" && errorMessage && errorMessage.indexOf(":")!=-1){
                     errorMessage = errorMessage.substring(0,errorMessage.indexOf(":"));
                 }
                 jQuery('#failMessage').html("<span class='label label-important'>" + textStatus + "</span> " + errorMessage);
                 jQuery('#failureMessage').css('display','block');
                 editor.cm.setValue(xhr.responseText);
             }
         });
     } else {
      jQuery('#emptyURIMessage').css('display','block');
     }
 },
 newResourceVersion : function(){
     var uri = jQuery('#savebtn').data("resource");
     if (uri){
         // create a new resource version
         jQuery.ajax({
             url: uri,
             type: 'PUT',
             data: editor.cm.getValue(),
             context: document.body,
             success: function(data, status, xhr){
                 jQuery('#successMessage').css('display','block');
             },
             error: function(jqXHR, textStatus, errorThrown){
                 jQuery('#failMessage').html("<span class='label label-important'>" + textStatus + "</span> " + errorThrown);
                 jQuery('#failMessage').css('display','block');
             }
         });
     } 
 }
};