jQuery(function(){
     editor.init();
     var resourceId = jQuery('.savebtn').eq(0).data("resource");
     editor.loadResource(resourceId);
     editor.displayResourceMetadata(resourceId);
     jQuery('.savebtn').click(editor.newResourceVersion);

     jQuery.ajax({
         url:'/sites/all/modules/austese_repository/ui/xslt/formats.xsl',
         success: function(xsl){
             editor.xsl = xsl;
         }
     });
 });
var generalElements = ["div","p","lb","l","pb","lg","hi","list","note"];
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
     return editor.completeAfter(cm, function() {
       var cur = cm.getCursor();
       return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) == "<";
     });
 },
 completeIfInTag: function(cm) {
     return editor.completeAfter(cm, function() {
       var tok = cm.getTokenAt(cm.getCursor());
       if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
       var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
       return inner.tagName;
     });
 },
 init : function(){
     var multi = jQuery('#metadata').data('multi');
     var target;
     var cmoptions = {
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
     };
     if (!multi){
         jQuery('#single-editor-ui').show();
         target = document.getElementById("editor");
         editor.cm = CodeMirror.fromTextArea(target, cmoptions);
         // folding only enabled for single editor - doesn't play well with copy from other version
         editor.cm.on("gutterClick", editor.foldXML);
     } else {
         jQuery('#multi-editor-ui').show();
         target = document.getElementById("multieditor");
         cmoptions.value = "";
         cmoptions.origLeft = null;
         
         cmoptions.orig = "";
         
         editor.mergeView = CodeMirror.MergeView(target, cmoptions);
         editor.cm = editor.mergeView.editor();
         editor.left = editor.mergeView.left;
         editor.right = editor.mergeView.right;
         var modulePath = jQuery('#metadata').data('modulepath');
         var project = jQuery('#metadata').data('project');
         jQuery("#lhs-select, #rhs-select").select2({
             placeholder: 'Search transcriptions by title or filename',
             minimumInputLength: 0,
             ajax: {
                 dataType: 'json',
                 url: '/' + modulePath + '/api/resources/',
                 data: function(term,page){
                     var searchParams = {
                         q: term,
                         type: 'text',
                         pageSize: 10,
                         page: page
                     };
                     if (project) {
                         searchParams.project = project;
                     }
                     return searchParams;
                 },
                 results: function (data, page) { 
                     var more = (page * 10) < data.count;
                     data.more = more;
                     return data;
                 }
             },
             formatResult: function(transcription){
                 return getTemplate('resourceBareDetail')(transcription);
                // return '<b>' + transcription.filename + "</b>" + (transcription.metadata.title? ", " + transcription.metadata.title : "");
             },
             formatSelection: function(transcription){
                 return getTemplate('resourceBareDetail')(transcription);
                 //return '<b>' + transcription.filename + "</b>" + (transcription.metadata.title? ", " + transcription.metadata.title : "");
             },
             escapeMarkup: function(m){return m;}
         }).on("change", function(e) {
             var origPanel = editor.left;
             if (e.currentTarget.id == 'rhs-select') {
                 origPanel = editor.right;
             }
            var transcriptionId = e.val; // json for transcription in e.added
            // load the transcription into the side panel
            jQuery.ajax({
                url: '/' + modulePath + '/api/resources/' + e.val,
                complete: function(xhr){
                    origPanel.orig.setValue(xhr.responseText);
                    origPanel.forceUpdate();
                }
            });
            
            
         });
     }
     
     editor.cm.on("update", editor.previewResource);
     
     
 },
 displayResourceMetadata : function(uri) {
     jQuery.ajax({
         url: uri,
         dataType: 'json',
         cache: false,
         context: document.body,
         headers: {
             'Accept': 'application/json'
         },
         success: function(data){
             data.modulePrefix = 'repository';
             // todo add projParam
             jQuery('#editInfo').html(getTemplate('resourceCompact')(data));
         },
         complete: function(xhr){
             console.log("complete",xhr)
         }
     });
 },
 loadResource : function(uri) {
     if (uri){
     jQuery.ajax({
             url: uri,
             context: document.body,
             cache:false,
             success: function(data, status, xhr){
                 jQuery('#metadata').data('contenttype', xhr.getResponseHeader('Content-Type'));
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
     var uri = jQuery('.savebtn').eq(0).data("resource");
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
 },
 previewResource: function(){
     if (editor.xsl && jQuery('#metadata').data('contenttype') == 'text/xml'){
         var text = editor.cm.getValue();
         var result = "Preview unavailable: Your browser does not support XSLT";
         if (window.ActiveXObject) { // IE
             var doc=new ActiveXObject('Microsoft.XMLDOM');
             doc.async='false';
             doc.loadXML(text);
             result = doc.transformNode(editor.xsl);
         } else if (document.implementation && document.implementation.createDocument){
             try {
                 var parser=new DOMParser();
                 var doc=parser.parseFromString(text,'text/xml');
                 xsltProcessor=new XSLTProcessor();
                 xsltProcessor.importStylesheet(editor.xsl);
                 result = xsltProcessor.transformToFragment(doc,document);
             } catch (error){
                 result = error.message;
             }
         }
         jQuery(".edit-preview").html(result);
     } else {
         // no preview, expand editor to fill page width
         jQuery('#editorspan').removeClass('span6').addClass('span12');
     }
 }
};