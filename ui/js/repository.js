jQuery.fn.serializeObject = function() {
     var o = {};
     var a = this.serializeArray();
     jQuery.each(a, function() {
         if (o[this.name] !== undefined) {
             if (!o[this.name].push) {
                 o[this.name] = [o[this.name]];
             }
             o[this.name].push(this.value || '');
         } else {
             o[this.name] = this.value || '';
         }
     });
     return o;
};
(function(){
    var apiType = null;
    var modulePath = null;
    var modulePrefix = null;
    var hasEditPermission = false;
    var apiOperation = null;
    var existingId = null;
    var serverName = null;
    var wysiEditors = [];
    jQuery(document).ready(function(){
        var metadata = jQuery('#metadata');
        // read parameters from data attributes set in the template
        apiType = metadata.data('apitype');
        apiOperation = metadata.data('apioperation');
        modulePath = metadata.data('modulepath');
        modulePrefix = metadata.data('moduleprefix');
        existingId = metadata.data('existingid');
        serverName = metadata.data('servername');
        // Note: it is drupal that actually enforces these permissions, 
        // the data attributes are only used to control whether to display the associated UI elements
        hasEditPermission = metadata.data('editable');
        if (apiOperation == "load"){
            // display list of results
            loadObjects(0);
            // set up handler for filter field
            jQuery('#filter').keyup(function(e) {
              if (e.keyCode == 13) {
                loadObjects(0,jQuery('#filter').val());
              }
            });
        } else if (apiOperation == "edit"){
            jQuery('#save-btn, .save-btn').on('click',onSave);
            if (existingId) {
                 loadObjectIntoEditor(existingId);
                 jQuery('#dupe-btn, .dupe-btn').css('display','inline').on('click',onDuplicate);
                 jQuery('#del-btn, .del-btn').css('display','inline').on('click',onDelete);
                 if (apiType=="resource"){
                     loadReferencedObjects();
                 }
            } else {
                // these are also called after load object
                wysiEditors.push(jQuery('#description').wysihtml5({"html": true}));
                wysiEditors.push(jQuery('#biography').wysihtml5({"html": true}));
                wysiEditors.push(jQuery('#references').wysihtml5({"html": true}));
           }
            jQuery('[autofocus=true]').on("change, blur", function(e){
               var fieldName = e.currentTarget.name;
               var searchTerm = jQuery(e.currentTarget).val();
               var project = jQuery('#metadata').data('project');
               if (searchTerm && searchTerm.length >= 3){
                   jQuery.ajax({
                        type: 'GET',
                        url: '/' + modulePath + '/api/' + apiType + 's/',
                        dataType: "json",
                        headers: {
                            'Accept': 'application/json'
                        },
                        data: {
                            searchField: fieldName, 
                            query: searchTerm, 
                            pageSize: 10,
                            project: project
                        },
                        failure: function(xhr){
                            console.log("failed to look up similar records",xhr)
                        },
                        success: function(result){
                            var display = "";
                            var matching = result.count;
                            jQuery.each(result.results,function(i,rec){
                                rec.modulePrefix = modulePrefix;
                                rec.newTab = true;
                                if (existingId != rec.id){
                                    display += getTemplate(apiType + 'Compact')(rec) + "; ";
                                } else {
                                    matching--;
                                }
                            });
                            if (matching){
                                jQuery('#existingOutput').html("Records with similar " + fieldName + ": " 
                                        + display + (result.count > 10? " and " + (result.count - 10) + " more": ""));
                            } else {
                                jQuery('#existingOutput').empty();
                            }
                        }
                    });
               } else {
                   jQuery('#existingOutput').empty();
               }
            });
                setInitialProject();
        
        } else {
            if (existingId){
                loadObject(existingId);
            } 
            if (apiType=='place'){
                // no sidebar for places, adjust size
                jQuery('#result').removeClass('span8').addClass('span12');
            }
        } 

        var setUpTagField = function(elem, apiType, searchProperty, params, single) {
            params = params || {};
            var select2opts = {
                placeholder: "Start typing to search " + apiType + "s by " + searchProperty,
                minimumInputLength: 0,
                multiple: (single ? false : true),
                ajax: {
                    dataType: 'json',
                    url: '/' + modulePath + '/api/' + apiType + 's/',
                    data: function(term,page){
                        var searchParams = {
                            query: term,
                            pageSize: 10,
                            pageIndex: page-1
                        };
                        jQuery.each(params,function(k,v){
                            searchParams[k] = v;
                        });
                        return searchParams;
                    },
                    results: function (data, page) { 
                        var more = (page * 10) < data.count;
                        data.more = more;
                        return data;
                    }
                },
                formatResult: function(res){
                    return getTemplate(apiType + 'TokenResult')(res);
                },
                formatSelection: function(res){
                    return getTemplate(apiType + 'Token')(res);
                },
                escapeMarkup: function(m){return m;}
            };
            if (!single){
                select2opts.tags = [];
            }
            elem.select2(select2opts);
            // add drag and drop reordering for tags
            elem.each(function(i,e){
                jQuery(e).select2("container").find("ul.select2-choices").sortable({
                    containment: 'parent',
                    start: function() { elem.select2("onSortStart"); },
                    update: function() { elem.select2("onSortEnd"); }
                });
            });
        };
        // set up search fields
        
        if (typeof (jQuery().select2) == 'function'){
            var project = jQuery('#metadata').data('project');
            var projectParam = {"project":project};
            setUpTagField(jQuery('#artefacts'), "artefact", 'source', projectParam);
            setUpTagField(jQuery('#events'),"event", "name", projectParam);
            setUpTagField(jQuery("#agents, #authors, #editors, #publishers, #printers, #influencers, #compositors, #amanuenses, #illustrators, #binders, #readers, #translators, #booksellers")
                    , "agent", "lastName", projectParam);
            setUpTagField(jQuery("#resources"), "resource", "filename", projectParam);
            setUpTagField(jQuery("#transcriptions"), "resource", "filename", {"project":project,"type":"text"});
            setUpTagField(jQuery("#facsimiles, #images"), "resource", "filename", {"project":project,"type":"image"});
            setUpTagField(jQuery('#places'), "place", "name");
            setUpTagField(jQuery("#versions"), "version","versionTitle", projectParam);
            setUpTagField(jQuery('#readingVersion'),"version","versionTitle",projectParam, true);
            setUpTagField(jQuery('#coverImage'),"resource","coverImage",projectParam, true);
            // allow freeform tags for tagging events 
            jQuery('#eventtags').select2({
                tags:[],
                multiple: true,
                formatResult: function(tag) {
                    return tag || tag.text;
                },
                formatSelection: function(tag) {
                    return tag.text || tag;
                },
                escapeMarkup: function(m) {return m;}
                });
            jQuery('#project').select2({
                placeholder: "Select a project",
                minimumInputLength: 0,
                multiple: false,
                ajax: {
                    dataType: 'json',
                    url: "/sites/all/modules/austese_repository/api/projects",
                    results: function (data) {
                        return {results: data.list};
                    },
                    cache: true
                },
                id: function(object) {
                    if (object) return object.nid;
                },
                formatResult: function(project) {
                    return project.title;
                },
                formatSelection: function(project) {
                    return project.title;
                },
                escapeMarkup: function(m) {return m;}
            });
        }
        
    });
    function loadObject(id){
        var template = apiType + 'Detail';
        
        jQuery.ajax({
            type: 'GET',
            url: '/' + modulePath + '/api/' + apiType + 's/' + id,
            dataType: "json",
            headers: {
                'Accept': 'application/json'
            },
            success: function(result){
                result.modulePrefix = modulePrefix;
                var project = jQuery('#metadata').data('project');
                if (project) {
                    result.projParam = "?project="+ project;
                }
                result.serverName = serverName;
                jQuery('#result').append(getTemplate(template)(result));
                loadReferencedObjects();
                if (apiType == "place"){
                 jQuery('#result').append('<p class="muted" style="clear:both">Place names taken from <a href="http://www.ga.gov.au/">Geoscience Australia</a> Gazetteer of Australia. Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.</p>');
                } if (result.metadata && result.metadata.filetype && result.metadata.filetype.match("image")){
                    jQuery("#editlink").hide();
                    jQuery("#pdflink").hide();
                    jQuery("#mswordlink").hide();
                    jQuery("#lightboxlink").show();
                    jQuery('#result').append('<script type="text/javascript">if (typeof enableAnnotations == \"function\"){enableAnnotations();}</script>');
                } else {
                    jQuery('#wordcloudlink').show();
                    jQuery("#editlink").show();
                }
                if (apiType == "resource" && result.metadata && result.metadata.filetype && (result.metadata.filetype.match("xml") || result.metadata.filetype.match("text"))) {
                    // transcription
                    loadRelatedMVDs(id);
                }
                loadInverseRelationships(id);
            }
        });
        
    }
    function loadInverseRelationships(id){
        function processInverseRelationships(queryApiType, queryField, queryId, title){
            
            var project = jQuery('#metadata').data('project');
            var projParam = (project? '?project=' + project : '');
            var defaultPageSize = 5;
            var queryData = {
                    query: queryId,
                    searchField: queryField,
                    pageSize: defaultPageSize
                };
            if (project) {
              queryData.project = project;
            }
            jQuery.ajax({
                type: 'GET',
                url: '/' + modulePath + '/api/' + queryApiType + 's/',
                data: queryData,
                dataType: "json",
                headers: {
                    'Accept': 'application/json'
                },
                success: function(result){
                    var display = "";
                    if (result.results.length > 0){
                      display += "<strong class=\"muted\">" + title + "</strong><ul>";
                      result.results.forEach(function(r){
                          r.modulePrefix = modulePrefix;
                          r.projParam = projParam;
                          if (queryApiType === "collection" && r.resources) {
                              var resourceIndex = jQuery.inArray(queryId,r.resources);
                              if (resourceIndex >= 0){
                                  r.resourceIndex = resourceIndex + 1;
                              }
                              r.collectionLength = r.resources.length;
                              if (resourceIndex !== 0) {
                                  r.prev = r.resources[resourceIndex-1];
                              }
                              if ((resourceIndex + 1) !== r.resources.length){
                                  r.next = r.resources[resourceIndex+1];
                              }
                          }
                          
                          if (queryField === "facsimiles" && r.facsimiles) {
                              var resourceIndex = jQuery.inArray(queryId ,r.facsimiles);
                              if (resourceIndex >= 0){
                                  r.resourceIndex = resourceIndex + 1;
                              }
                              r.collectionLength = r.facsimiles.length;
                              if (resourceIndex !== 0) {
                                  r.prev = r.facsimiles[resourceIndex-1];
                              }
                              if ((resourceIndex + 1) !== r.facsimiles.length){
                                  r.next = r.facsimiles[resourceIndex+1];
                              }
                          }

                          if (queryField === 'artefacts' && r.artefacts) {
                              var resourceIndex = jQuery.inArray(queryId ,r.artefacts);
                              if (resourceIndex >= 0){
                                  r.resourceIndex = resourceIndex + 1;
                              }
                              r.collectionLength = r.artefacts.length;
                              if (resourceIndex !== 0) {
                                  r.prev = r.artefacts[resourceIndex-1];
                              }
                              if ((resourceIndex + 1) !== r.artefacts.length){
                                  r.next = r.artefacts[resourceIndex+1];
                              }
                          }
                          
                          display += "<li>" + getTemplate(queryApiType + 'Compact')(r) +"</li>";
                      });
                      display += "</ul>";
                      if (result.count > defaultPageSize) {
                          // TODO: display link to search page to view all
                          display += "<p><small class='muted'>plus " + (result.count - defaultPageSize) + " more</small></p>";
                      }
                      var div = jQuery('<div>' + display + '</div>');
                      jQuery('#relatedObjects').append(div);
                      enablePopups(div);
                    }
                }
            });
        }
        
        // FIXME: maintain consistent order of display
        if (apiType == "artefact"){
            // artefacts are linked to from versions, events and artefacts
            processInverseRelationships("version","artefacts",id,"Contains Version");
            processInverseRelationships("event","artefacts",id,"Produced by Event"); 
            processInverseRelationships("artefact","artefacts",id, "Part Of Artefact");
        } else if (apiType == "version") {
            // versions are linked to from works and versions
            processInverseRelationships("version","versions",id, "Part Of Version");
            processInverseRelationships("work","versions", id, "Version of Work");
        } else if (apiType=="agent"){
            ["agents", "authors", "amanuenses", "influencers", "editors", "publishers",
             "printers", "compositors", "illustrators", "binders", "readers", "translators",
             "booksellers"].forEach(function(key){
                var elabel;
                switch (key) {
                  case "amanuenses": elabel = "Is amanuensis for"; break;
                  default: elabel = "Participated as " + key.substr(0, key.length - 1) + " in:";
                }
                
                processInverseRelationships("event", key, id, elabel);
             });
        } else if (apiType == "resource"){
            processInverseRelationships("version","transcriptions",id, "Transcription of Version");
            processInverseRelationships("collection", "resources", id, "In Collection");
            processInverseRelationships("artefact","transcriptions",id, "Diplomatic Transcription of Artefact");
            processInverseRelationships("artefact","facsimiles",id, "Facsimile of Artefact");
            processInverseRelationships("agent","images",id, "Image of");
        } else if (apiType == "event"){
            
            processInverseRelationships("event","events",id,"Part Of");
        }
    }
    function loadObjects(page, filterTerm){
        page = page || 0;
        var project = jQuery('#metadata').data('project');
        var pageSize = 20;
        if (apiType == 'place'){
            pageSize = 15;
        }
        var sort = jQuery('#sort').val()
        console.log("sort by " + sort);
        jQuery.ajax({
           type: 'GET',
           url: '/' + modulePath + '/api/' + apiType + 's/',
           dataType: "json",
           data: {
               pageSize: pageSize,
               pageIndex: page,
               query: (filterTerm?  filterTerm : ""),
               project: (project && !(apiType == 'place') ? project : ""),
               sort: sort
           },
           success: function(result){
             var rescount = parseInt(result.count);
             var numPages = Math.floor(rescount/pageSize) + 1;
             jQuery('#resultsummary').html("Found " + result.count + " " + apiType + (rescount != 1? "s" : "") + (filterTerm? (" matching '" + filterTerm + "'") : "") + ", ");
             jQuery('#resultcurrent').html("displaying page " + (page + 1) + " of " + numPages); 
             jQuery('#result').empty();
             var project = jQuery('#metadata').data('project');
             var template = apiType + jQuery('#metadata').data('template');
             if (apiType == "place"){
                 jQuery('#result').append('<p class="muted" style="clear:both">Place names taken from <a href="http://www.ga.gov.au/">Geoscience Australia</a> Gazetteer of Australia. Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.</p>');
             }
             for (var i = 0; i < pageSize; i++){
                var obj = result.results[i];
                if (obj){
                    obj.hasEditPermission = hasEditPermission;
                    obj.modulePrefix = modulePrefix;
                    if (project) {
                        obj.projParam = "?project=" + project;
                        obj.projAndParam = "&project=" + project;
                    }
                    try {
                      jQuery('#result').append(getTemplate(template)(obj));
                    } catch (e){
                        console.log("error applying template",template, obj, e);
                    }
                }
             }
             loadReferencedObjects();
             updatePager(page, numPages, filterTerm);
           }
        });
    }
    function tokenizeListField(data, fieldType, fieldName) {
        fieldName = fieldName || fieldType;
        var field = data[fieldName];
        if (field){
            var fieldLength = field.length;
            if (fieldLength > 0){
                var getToken = function(index){
                jQuery.ajax({
                  type: 'GET',
                  dataType: 'json',
                  headers: {
                       'Accept': 'application/json'
                  },
                  url: '/' + modulePath + '/api/' + fieldType + '/' + field[index],
                  success: function(v){
                      var elem = jQuery('#' + fieldName);
                      
                      // add the new value to the list
                      var existVal = elem.select2("data");
                      if (existVal instanceof Array){
                          existVal.push(v);
                      } else {
                          existVal = v;
                      }
                      elem.select2("data",existVal);
                      
                      if (index < (fieldLength - 1)){
                          getToken(index+1);
                      } 
                  }
                });
            }
                getToken(0);
            }
        }
    }
    function setInitialProject() {
        var elem = jQuery('#project');
        var project = jQuery('#metadata').data('project');
        
        if (project) {
            jQuery.ajax("/node/" + project + ".json").done(function(data) {
                elem.select2("data", data);
                elem.select2("readonly", true);
            });
        }
    }
    function loadProjectData() {
        var elem = jQuery('#project');
        var id = elem.val();
        if (id) {
            jQuery.ajax("/node/" + id + ".json").done(function(data) {
                elem.select2("data", data);
            });
        }
    }
    function loadObjectIntoEditor(id){
        jQuery.ajax({
           url: '/' + modulePath + '/api/' + apiType + 's/'+ id,
           dataType: 'json',
           headers: {
               'Accept': 'application/json'
           },
           success: function(d){
              js2form(document.getElementById('create-object'), d);
              if (d.readingVersion){
                  d.readingVersion = [d.readingVersion];
                  tokenizeListField(d,'versions','readingVersion');
              }
              if (d.coverImage){
                  d.coverImage = [d.coverImage];
                  tokenizeListField(d,'resources','coverImage');
              }
              tokenizeListField(d,'versions');
              tokenizeListField(d,'artefacts');
              tokenizeListField(d,'agents');
              tokenizeListField(d,'agents','authors');
              tokenizeListField(d,'agents','editors');
              tokenizeListField(d,'agents','publishers');
              tokenizeListField(d,'agents','printers');
              tokenizeListField(d,'agents','influencers');
              tokenizeListField(d,'agents','compositors');
              tokenizeListField(d,'agents','amanuenses');
              tokenizeListField(d,'agents','illustrators');
              tokenizeListField(d,'agents','binders');
              tokenizeListField(d,'agents','readers');
              tokenizeListField(d,'agents','translators');
              tokenizeListField(d,'agents','booksellers');
              tokenizeListField(d,'events');
              tokenizeListField(d,'resources');
              tokenizeListField(d,'resources','transcriptions');
              tokenizeListField(d,'resources','images');
              tokenizeListField(d,'resources','facsimiles');
              tokenizeListField(d,'places');
              if (d.eventtags){
                  var etags = [];
                  for (var et = 0; et< d.eventtags.length; et++){
                      etags.push({id:d.eventtags[et],text:d.eventtags[et]})
                  }
                  jQuery('#eventtags').select2("data",etags);
              }
              // set up WYSIWYG editor
              wysiEditors.push(jQuery('#description').wysihtml5({"html": true}));
              wysiEditors.push(jQuery('#biography').wysihtml5({"html": true}));
              wysiEditors.push(jQuery('#references').wysihtml5({"html": true}));
              updateUILocked(d.locked || false);
              //
              loadProjectData();
           }
        });
    }
    function onDelete(){
       jQuery.ajax({
          type: 'DELETE',
          url: '/' + modulePath + '/api/' + apiType + 's/' + existingId,
          success: function(d){
            var project = jQuery('#metadata').data('project');
            jQuery('#alerts').append(
                jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button>' 
                    + '<h4>Successfully deleted ' + apiType +'</h4><p>'
                    + (apiType != "mvd"? '<a id="last-minute-undo" href="javascript:void(0);">Undo</a>' : "") + '</p>'
                    + '<p><a href="/' + modulePrefix + '/' + apiType + 's' + (project? '?project=' + project : '') +'">View ' + apiType + 's</a></p></div>').alert());
            jQuery('#last-minute-undo').on('click', onSave);
            window.scrollTo(0,0);
          }
       });
    }
    function onDuplicate(){
        delete existingId;
        jQuery('#metadata').removeAttr('data-existingid').removeData('existingid');
        onSave();
    }
    function onSave(){
        var existingId = jQuery('#metadata').data('existingid');
        var type = 'POST';
        var url = '/' + modulePath + '/api/' + apiType + 's/';
        if (existingId) {
           type = 'PUT';
           url += existingId;
        }
        var newObject =  !(existingId || false);
        var data = jQuery('#create-object').serializeObject();
        function splitField(data,fieldNames){
            for (var i = 0; i < fieldNames.length; i++){
                var fieldName = fieldNames[i];
                if (data[fieldName]){
                    if (data[fieldName] && data[fieldName].split){
                        var split = data[fieldName].split(",");
                        data[fieldName] = [];
                        for (var j = 0; j < split.length; j++){
                           data[fieldName].push(split[j]);
                        }
                    }
                }
            }
        }
        splitField(data,['eventtags','artefacts','events','agents','authors','editors', 'publishers', 'printers', 'influencers', 'compositors', 'amanuenses', 'illustrators', 'binders', 'readers', 'translators', 'booksellers', 'versions','transcriptions','resources','images','facsimiles','places']);
        if (data["_wysihtml5_mode"]){
            delete data["_wysihtml5_mode"];
        }
        var locked = data.locked || false;
        jQuery.ajax({
          type: type,
          data: JSON.stringify(data),
          headers: {
              'Content-Type': 'application/json'
          },
          url: url,
          success: function(d){
            var project = jQuery('#metadata').data('project');
            jQuery('#alerts').html(
                jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button>'
                    + '<h4>Successfully saved ' + apiType + '</h4>'
                    + '<p><a href="/' + modulePrefix + '/' + apiType + 's/' + existingId + (project? '?project='+project : '') +'">View ' + apiType + '</a></p></div>').alert());
                if (d){
                    existingId = d.id;
                    jQuery('#metadata').data('existingid',d.id);
                }
                window.scrollTo(0,0);
                updateUILocked(locked);
                // load new page URI (because we have an id for the new object)
                if (newObject){
                   document.location.href= '/' + modulePrefix + "/" + apiType + 's/edit/'  + existingId + (project? '?project='+project : '');
                }
                
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error saving record: ', jqXHR);
            jQuery('#alerts').append(
                jQuery('<div class="alert alert-error alert-block"><button type="button" class="close" data-dismiss="alert">x</button>'
                    + '<h4>Error saving ' + apiType + '</h4>'
                    + '<p>' + textStatus + ': ' + errorThrown + '</p></div>').alert());
            window.scrollTo(0,0);
          }
        });
    }
    function updateUILocked(locked){
        // update UI editability to reflect locked/unlocked state
        var inputs = jQuery('#create-object')
            .find('fieldset:not(:last)')
            .find('input, textarea');
        inputs.attr('readonly',locked);
        jQuery(wysiEditors).each(function(i,e){
            var editorData = e.data("wysihtml5");
            if (editorData){
                if (locked) {
                    editorData.editor.disable();
                    jQuery('.wysihtml5-toolbar').hide();
                } else {
                    editorData.editor.enable();
                    jQuery('.wysihtml5-toolbar').show();
                }
            }
        });
    }
    function loadRelatedMVDs(id){
        jQuery.ajax({
            url: '/' + modulePath + '/api/mvds/?query=' + id,
            success: function(d){
                if (d.results.length > 0) {
                    var result = "<h4 class='muted'>VIEW MVD:</h4><form onsubmit='return false;'><select id='mvdselect'>";
                    var res = "";
                    for (var i = 0; i < d.results.length; i++){
                        res = d.results[i];
                        var refreshURL = '/collationtools/sendtomvd/';
                        for (var j = 0; j < res.resources.length; j++){
                            var resData = res.resources[j];
                            refreshURL += (resData.id? resData.id : resData) + ';';
                        }
                        refreshURL += '?docpath=' + res.name;
                        result += '<option data-refresh="' + refreshURL + '" value="' + res.name + '">' + decodeURIComponent(res.name) + '</option>';
                        
                    }
                    result+= '</select>'
                        + '<div><button id="comparebtn" class="btn btn-small">Compare</button>'
                        + '&nbsp;<button id="tablebtn" class="btn btn-small">Table</button>'
                        + '&nbsp;<button id="refreshbtn" class="btn btn-small">Refresh</button>'
                        + '</div></form>';
                    jQuery('#viewmvd').append(result);
                    jQuery('#comparebtn').on('click',viewCompare);
                    jQuery('#tablebtn').on('click',viewTable);
                    jQuery('#refreshbtn').on('click',refreshMVD);
                    // FIXME: Look up actual full id of version e.g. id/base or /Base/id
                    /*var url = '/html/' + encodeURIComponent(res.name) + "?version1=%2f"  + id + "%2fbase";
                    jQuery('#result').append("<script type='text/javascript'>jQuery.ajax({url:'" + url + "', " 
                            + "success: function(r){if (r.indexOf(\"HritServer Error\") == -1){"
                            + "jQuery('#result').append('<div data-id=\"http://" + serverName + "/repository/resources/" + existingId + "/content\" class=\"well\">' + r + '</div>');"
                            + "if (typeof enableAnnotations == \"function\"){enableAnnotations();}" 
                            + "}}})</script>");
                    */
                }
            }
        });
    }
    function viewCompare(){
        var docpath = jQuery('#mvdselect').val();
        var project = jQuery('#metadata').data('project');
        var projParam = (project? '?project=' + project : '');
        if (docpath) {
            // TODO actually select this resource
            document.location.href = "/collationtools/compare" + projParam + "#" + encodeURIComponent(docpath);
        }
    }
    function viewTable(){
        var docpath = jQuery('#mvdselect').val();
        var project = jQuery('#metadata').data('project');
        var projParam = (project? '?project=' + project : '');
        if (docpath) {
            // TODO actually select this resource
            document.location.href = "/collationtools/apparatus" + projParam + "#" + encodeURIComponent(docpath);
        }
    }
    function refreshMVD(){
        var project = jQuery('#metadata').data('project');
        var projParam = (project? '&project=' + project : '');
        var refreshURL = jQuery('#mvdselect').find('option:selected').data('refresh');
        if (refreshURL) {
            jQuery('#viewmvd').append("Refreshing MVD, please wait...");
            document.location.href = refreshURL + projParam;
        }
    }
    function loadReferencedObjects(){
        enablePopups();
        jQuery(".place").each(function(){
            var elem = jQuery(this);
            var template = elem.data('template');
            jQuery.ajax({
              type: 'GET',
              url: '/' + modulePath + '/api/places/' + elem.data('placeid'),
              success: function(d){
                var project = jQuery('#metadata').data('project');
                d.modulePrefix = modulePrefix;
                d.projParam = (project? '?project=' + project : '');
                if (template && template == "compact"){
                    elem.html(getTemplate("placeCompact")(d));
                } 
              }
            });
        });
        jQuery(".resource").each(function(){
            var elem = jQuery(this);
            var template = elem.data('template');
            jQuery.ajax({
              type: 'GET',
              url: '/' + modulePath + '/api/resources/' + elem.data('resourceid'),
              dataType: "json",
              headers: {
                  'Accept': 'application/json'
              },
              success: function(d){
                var project = jQuery('#metadata').data('project');
                d.projParam = (project? '?project=' + project : '');
                d.modulePrefix = modulePrefix;
                d.hasEditPermission = jQuery('#metadata').data('editable');
                if (template && template == "summary"){
                    elem.html(getTemplate("resourceSummary")(d));
                } else if (template && template == "compact") {
                    elem.html(getTemplate("resourceCompact")(d));
                } else if (template == "image"){
                    elem.html(getTemplate("imageEmbed")(d));
                } else if (template == "imageScale"){
                    elem.html(getTemplate("imageScaleEmbed")(d));
                } else {
                    var temp = getTemplate(template);
                    if (temp){
                        elem.html(temp(d));
                    }
                }
              }
            });
        });
        // Load maps and featurecodes (e.g. on view place or list place page)
        jQuery('.minimap').each(function(i, el){
            var lat = jQuery(el).data('lat');
            var long = jQuery(el).data('long');
            var map = L.map(el).setView([lat, long], 6);
            var marker = L.marker([lat, long]).addTo(map);
            var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
                subDomains = ['otile1','otile2','otile3','otile4']; 
            L.tileLayer(mapquestUrl, {maxZoom: 18, subdomains: subDomains}).addTo(map);
         });
        displayFeatureCodes(false);
        
        jQuery(".artefact").each(function(){
            var elem = jQuery(this);
            var template = elem.data('template');
            jQuery.ajax({
              type: 'GET',
              url: '/' + modulePath + '/api/artefacts/' + elem.data('artefactid'),
              success: function(d){
                  var project = jQuery('#metadata').data('project');
                  d.projParam = (project? '?project=' + project : '');
                  d.modulePrefix = modulePrefix;
                  d.hasEditPermission = jQuery('#metadata').data('editable');
                  if (template && template == 'summary'){
                      elem.html(getTemplate("artefactSummary")(d));
                  }
                  
              }
            });
        });
        
        jQuery(".version").each(function(){
            var elem = jQuery(this);
            var template = elem.data('template');
            jQuery.ajax({
              type: 'GET',
              url: '/' + modulePath + '/api/versions/' + elem.data('versionid'),
              success: function(d){
                var project = jQuery('#metadata').data('project');
                d.projParam = (project? '?project=' + project : '');
                d.modulePrefix = modulePrefix;
                d.hasEditPermission = jQuery('#metadata').data('editable');
                if (template && template == 'summary'){
                    elem.html(getTemplate("versionSummary")(d));
                }
              }
            });
          });
        jQuery(".agent").each(function(){
            var elem = jQuery(this);
            var template = elem.data('template');
            jQuery.ajax({
              type: 'GET',
              url: '/' + modulePath + '/api/agents/' + elem.data('agentid'),
              success: function(d){
                var project = jQuery('#metadata').data('project');
                d.projParam = (project? '?project=' + project : '');
                d.modulePrefix = modulePrefix;
                d.hasEditPermission = jQuery('#metadata').data('editable');
                if (template && template == 'summary'){
                    elem.html(getTemplate("agentSummary")(d));
                    enablePopups(elem);
                }
              }
            });
        });
        jQuery(".event").each(function(){
            var elem = jQuery(this);
            var template = elem.data('template');
            jQuery.ajax({
              type: 'GET',
              url: '/' + modulePath + '/api/events/' + elem.data('eventid'),
              success: function(d){
                var project = jQuery('#metadata').data('project');
                d.projParam = (project? '?project=' + project : '');
                d.modulePrefix = modulePrefix;
                d.hasEditPermission = jQuery('#metadata').data('editable');
                if (template && template == 'summary'){
                    elem.html(getTemplate("eventSummary")(d));
                }
              }
            });
        });
        
    }
    function enablePopups(context){
        context = (context? jQuery(context).find('.obj > h4,h5 >  a') : jQuery('.obj > h4,h5 > a'));
        context.popover({
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
    function displayFeatureCodes(){
        jQuery.ajax({
            type: 'GET',
            url: '/' + modulePath + '/api/featurecodes/',
            success: function(d){
                var codes = d.results;
                if (codes){
                    jQuery('.featureCode').each(function(i,el){
                        var truncate = false;
                        if (jQuery(el).data('truncate')){
                            truncate = true;
                        }
                        var featureCode = jQuery(el).html();
                        var featureCodeDesc = codes[featureCode],
                            featureCodeShort = featureCodeDesc;
                        if (truncate && featureCodeDesc.length > 50){
                            featureCodeShort = jQuery.trim(featureCodeShort).substring(0, 50).trim(this) + "...";
                        }
                        jQuery(el).html(featureCodeShort).attr('title',featureCode + ": " + featureCodeDesc);
                    });
                }
            }
          });
    }
    function onSaveResource(){ 
        var formData = new FormData(jQuery('#create-object')[0]);
        jQuery.ajax({
          type: 'POST',
          enctype: 'multipart/form-data',
          data: formData,
          url: '/' + modulePath + '/api/resources/',
          success: function(d){
            jQuery('#alerts').append(jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button><h4>Resource uploaded</h4></div>').alert());
            window.scrollTo(0,0);
          }
        });
    }
    function updatePager(page, numPages, filterTerm){
        var startIndex = Math.max(0,page - 5);
        var endIndex = Math.min(numPages, page+5);
        if (page <= 5){
            endIndex += (5 - page);
            endIndex = Math.min(endIndex,numPages);
        }
        jQuery('#pager').empty();
        if (startIndex > 0){
          jQuery('#pager').append(jQuery("<button class='btn'><i class='fa fa-chevron-left'></i></button>").click(function(){
            loadObjects(page-1, filterTerm);
         }));
       }
       for (var i = startIndex; i < endIndex; i++){
          var cls = "btn pagebtn";
          if (i == page){
            cls += " btn-highlight";
          }
          jQuery('#pager').append("<button class='" + cls + "'>" + (i + 1) + "</button>");
          
       }
       jQuery('.pagebtn').click(function(){
           var pageNum = parseInt(jQuery(this).html() - 1);
           loadObjects(pageNum,filterTerm);
           jQuery('body').scrollTop(0);
       });
       jQuery('#sort').on('change',function(){
           //try {
           //var page = parseInt(jQuery('#pager').find('.btn-highlight').text()) - 1;
           //    loadObjects(page,filterTerm);
           //} catch (e){
               loadObjects(0,filterTerm);
           //}
           
       });
       if(numPages > endIndex){
           jQuery('#pager').append(jQuery("<button class='btn'><i class='fa fa-chevron-right'></i></button>").click(function(){
              loadObjects(page+1, filterTerm);
           }));
       }
    }
    
})();
