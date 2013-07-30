jQuery(function(){
     editor.init();
     editor.loadResource(jQuery('#savebtn').data("resource"));
     jQuery('#savebtn').click(editor.newResourceVersion);
 });
var generalElements = ["div","p","lb","l","pb","hi","list","note"];
var generalAttrs = {"xml:id":null,"n":null,"xml:lang":null,"rend":null};
var divAttrs = generalAttrs;
divAttrs.type=null;
var tags = {
   "!top": ["TEI", "div"],
   TEI: {
       children:["teiHeader","text"]
   },
   teiHeader: {
       children:["fileDesc"]
   },
   text: {
       children:["body", "front","back"]
   },
   fileDesc:{
       children:["titleStmt","publicationStmt","sourceDesc"]
   },
   titleStmt: {
       children:["title","respStmt"]
   },
   respStmt: {
       children:["resp","name"]
   },
   div: {
       children: generalElements,
       attrs: divAttrs
   },
   front: {children:generalElements},
   back: {children:generalElements},
   body: {children:generalElements},
   list: {
       children: ["item"],
       attrs: generalAttrs
   },
   p: {
       attrs: generalAttrs
   },
   l: {
       attrs: generalAttrs
   },
   lb: {
       attrs: generalAttrs
   },
   pb: {
       attrs: generalAttrs
   },
   hi: {
       attrs: generalAttrs
   },
   note: {
       attrs: generalAttrs
   },
   item: {
       attrs: generalAttrs
   }
};
var editor = {
 foldXML: function(cm, where) { 
            cm.foldCode(where, CodeMirror.tagRangeFinder); 
 },
 completeAfter: function(cm, pred) {
     var cur = cm.getCursor();
     if (!pred || pred()) setTimeout(function() {
       if (!cm.state.completionActive)
         CodeMirror.showHint(cm, CodeMirror.hint.xml, {schemaInfo: tags, completeSingle: false});
     }, 100);
     return CodeMirror.Pass;
 },

 completeIfAfterLt: function(cm) {
     return completeAfter(cm, function() {
       var cur = cm.getCursor();
       return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) == "<";
     });
 },
 completeIfInTag: function(cm) {
     return completeAfter(cm, function() {
       var tok = cm.getTokenAt(cm.getCursor());
       if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
       var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
       return inner.tagName;
     });
 },
 init : function(){
     editor.cm = CodeMirror.fromTextArea(document.getElementById("editor"), {
         mode: {
             name: "xml", 
             alignCDATA: true
         },   
         autoCloseTags: true,
         lineWrapping: true,
         lineNumbers: true,
         matchTags: true,
         extraKeys: {
             "'<'": editor.completeAfter,
             "'/'": editor.completeIfAfterLt,
             "' '": editor.completeIfInTag,
             "'='": editor.completeIfInTag,
             "Ctrl-Space": function(cm) {
               CodeMirror.showHint(cm, CodeMirror.hint.xml, {schemaInfo: tags});
             }
         }
     }); 
     editor.cm.on("gutterClick", editor.foldXML);
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
     jQuery('.alert').hide();
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