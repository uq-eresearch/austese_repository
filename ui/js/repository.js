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
            jQuery('#save-btn').on('click',onSave);
            if (existingId) {
             loadObjectIntoEditor(existingId);
             jQuery('#dupe-btn').css('display','inline').on('click',onDuplicate);
             jQuery('#del-btn').css('display','inline').on('click',onDelete);
            } else {
                wysiEditors.push(jQuery('#description').wysihtml5());
                wysiEditors.push(jQuery('#biography').wysihtml5());
            }
        
        } else {
            if (existingId){
                loadObject(existingId);
            } 
        } 

        // set up search fields
        if (typeof (jQuery().tokenInput) == 'function'){
            var project = jQuery('#metadata').data('project');
            var projectParam = (project? "?project=" + project : "");
            jQuery("#artefacts").tokenInput("/" + modulePath + "/api/artefacts/" + projectParam, {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search artefacts by source",
                jsonContainer: "results",
                propertyToSearch: "source",
                resultsFormatter: function(item){return "<li><b>" + item.source + "</b>, " + item.date + "</li>";},
                tokenFormatter: function(item){return "<li>" + item.source + ", " + item.date + "</li>";}
            });
            jQuery("#events").tokenInput("/" + modulePath + "/api/events/" + projectParam, {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search events by description",
                jsonContainer: "results",
                propertyToSearch: "description",
                resultsFormatter: function(item){return "<li><b>" + item.description + "</b>, " + item.eventType + "</li>";},
                tokenFormatter: function(item){return "<li>" + item.description + ", " + item.eventType + "</li>";}
            });
            jQuery("#agents").tokenInput("/" + modulePath + "/api/agents/" + projectParam, {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search agents by last name",
                jsonContainer: "results",
                propertyToSearch: "lastName",
                resultsFormatter: function(item){return "<li><b>" + item.firstName + " " + item.lastName + "</b></li>";},
                tokenFormatter: function(item){return "<li>" + item.firstName + " " + item.lastName + "</li>";}
            });
            jQuery("#transcriptions").tokenInput("/" + modulePath + "/api/resources/" + projectParam + (projectParam? "&" : "?") + "type=x", {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search transcriptions by filename/title",
                jsonContainer: "results",
                propertyToSearch: "filename",
                resultsFormatter: function(item){return "<li><b>" + item.metadata.title + " (" + item.filename + ")</b></li>";},
                tokenFormatter: function(item){return "<li title=\"" + item.metadata.title + "\">" + item.filename + "</li>";}
            });
            jQuery("#facsimiles, #images").tokenInput("/" + modulePath + "/api/resources/" + projectParam + (projectParam? "&" : "?") + "type=image", {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search images by filename/title",
                jsonContainer: "results",
                propertyToSearch: "filename",
                resultsFormatter: function(item){return "<li><b>" + item.metadata.title + " (" + item.filename + ")</b></li>";},
                tokenFormatter: function(item){return "<li title=\"" + item.metadata.title + "\">" + item.filename + "</li>";}
            });
            jQuery("#resources").tokenInput("/" + modulePath + "/api/resources/" + projectParam, {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search resources by filename/title",
                jsonContainer: "results",
                propertyToSearch: "filename",
                resultsFormatter: function(item){return "<li><b>" + item.metadata.title + " ("  + item.filename + ")</b></li>";},
                tokenFormatter: function(item){return "<li title=\"" + item.metadata.title + "\">" + item.filename + "</li>";}
            });
            jQuery('#places').tokenInput("/" + modulePath + "/api/places/", {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search places by name",
                jsonContainer: "results",
                propertyToSearch: "name",
                resultsFormatter: function(item){return "<li><b>" + item.name + "</b>, " + item.state + "</li>";},
                tokenFormatter: function(item){return "<li>" + item.name + ", " + item.state + "</li>";}
            });
            jQuery("#versions").tokenInput("/" + modulePath + "/api/versions/" + projectParam, {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search versions by title",
                jsonContainer: "results",
                propertyToSearch: "versionTitle",
                resultsFormatter: function(item){return "<li><b>"+item.versionTitle + "</b>, " + item.name + ", " + item.date + "</li>";},
                tokenFormatter: function(item){return "<li>" + item.versionTitle + ", " + item.name + ", " + item.date + "</li>";}
            });
        }
        
    });
    function loadObject(id){
        var template = templates[apiType + 'Detail'];
        
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
                jQuery('#result').append(template(result));
                loadReferencedObjects();
                if (apiType == "place"){
                 jQuery('#result').append('<p class="muted" style="clear:both">Place names taken from <a href="http://www.ga.gov.au/">Geoscience Australia</a> Gazetteer of Australia. Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.</p>');
                } if (result.metadata && result.metadata.filetype.match("image")){
                    jQuery("#editlink").hide();
                    jQuery("#lightboxlink").show();
                    jQuery('#result').append('<script type="text/javascript">if (typeof enableAnnotations == \"function\"){enableAnnotations();}</script>');
                } else {
                    jQuery("#editlink").show();
                }
                if (apiType == "resource" && result.metadata && (result.metadata.filetype.match("xml") || result.metadata.filetype.match("text"))) {
                    // transcription
                    loadRelatedMVDs(id);
                }
            }
        });
        
    }
    function loadObjects(page, filterTerm){
        page = page || 0;
        var project = jQuery('#metadata').data('project');
        var pageSize = 20;
        if (apiType == 'place'){
            pageSize = 15;
        }
        jQuery.ajax({
           type: 'GET',
           url: '/' + modulePath + '/api/' + apiType + 's/',
           dataType: "json",
           data: {
               pageSize: pageSize,
               pageIndex: page,
               q: (filterTerm?  filterTerm : ""),
               project: (project && !(apiType == 'place' || apiType == 'mvd') ? project : "")
           },
           success: function(result){
             var rescount = parseInt(result.count);
             var numPages = Math.floor(rescount/pageSize) + 1;
             jQuery('#resultsummary').html("Found " + result.count + " " + apiType + (rescount != 1? "s" : "") + (filterTerm? (" matching '" + filterTerm + "'") : "") + ", ");
             jQuery('#resultcurrent').html("displaying page " + (page + 1) + " of " + numPages); 
             jQuery('#result').empty();
             var project = jQuery('#metadata').data('project');
             var template = templates[apiType + "Summary"];
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
                    }
                    jQuery('#result').append(template(obj));
                }
             }
             loadReferencedObjects();
             updatePager(page, numPages, filterTerm);
           }
        });
    }
    function loadObjectIntoEditor(id){
        jQuery.ajax({
           url: '/' + modulePath + '/api/' + apiType + 's/'+ id,
           success: function(d){
              js2form(document.getElementById('create-object'), d);
              if (d.versions){
                  for (var i = 0; i < d.versions.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     url: '/' + modulePath + '/api/versions/' + d.versions[i],
                     success: function(v){
                       jQuery('#versions').tokenInput("add",v);
                     }
                   });
                  }
              }
              if (d.artefacts){
                  for (var i = 0; i < d.artefacts.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     url: '/' + modulePath + '/api/artefacts/' + d.artefacts[i],
                     success: function(v){
                       jQuery('#artefacts').tokenInput("add",v);
                     }
                   });
                  }
              }
              if (d.agents){
                  for (var i = 0; i < d.agents.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     url: '/' + modulePath + '/api/agents/' + d.agents[i],
                     success: function(v){
                       jQuery('#agents').tokenInput("add",v);
                     }
                   });
                  }
              }
              if (d.events){
                  for (var i = 0; i < d.events.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     url: '/' + modulePath + '/api/events/' + d.events[i],
                     success: function(v){
                       jQuery('#events').tokenInput("add",v);
                     }
                   });
                  }
              }
              if (d.transcriptions){
                  for (var i = 0; i < d.transcriptions.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     dataType: "json",
                     headers: {
                          'Accept': 'application/json'
                     },
                     url: '/' + modulePath + '/api/resources/' + d.transcriptions[i],
                     success: function(v){
                       jQuery('#transcriptions').tokenInput("add",v);
                     }
                   });
                  }
              }
              if (d.images){
                  for (var i = 0; i < d.images.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     dataType: "json",
                     headers: {
                          'Accept': 'application/json'
                     },
                     url: '/' + modulePath + '/api/resources/' + d.images[i],
                     success: function(v){
                       jQuery('#images').tokenInput("add",v);
                     }
                   });
                  }
              }
              if (d.facsimiles){
                  for (var i = 0; i < d.facsimiles.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     url: '/' + modulePath + '/api/resources/' + d.facsimiles[i],
                     dataType: "json",
                     headers: {
                          'Accept': 'application/json'
                     },
                     success: function(v){
                       jQuery('#facsimiles').tokenInput("add",v);
                     }
                   });
                  }
              }
              if (d.resources){
                  for (var i = 0; i < d.resources.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     url: '/' + modulePath + '/api/resources/' + d.resources[i],
                     dataType: "json",
                     headers: {
                          'Accept': 'application/json'
                     },
                     success: function(v){
                       jQuery('#resources').tokenInput("add",v);
                     }
                   });
                  }
              }
              if (d.places){
                  for (var i = 0; i < d.places.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     url: '/' + modulePath + '/api/places/' + d.places[i],
                     success: function(v){
                       jQuery('#places').tokenInput("add",v);
                     }
                   });
                  }
              }
              // set up WYSIWYG editor
              wysiEditors.push(jQuery('#description').wysihtml5());
              wysiEditors.push(jQuery('#biography').wysihtml5());
              updateUILocked(d.locked || false);
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
        if (data.artefacts){
            var split = data.artefacts.split(",");
            data.artefacts = [];
            for (var i = 0; i < split.length; i++){
               data.artefacts.push(split[i]);
            }
        }
        if (data.events){
            var split = data.events.split(",");
            data.events = [];
            for (var i = 0; i < split.length; i++){
               data.events.push(split[i]);
            }
        }
        if (data.agents){
            var split = data.agents.split(",");
            data.agents = [];
            for (var i = 0; i < split.length; i++){
               data.agents.push(split[i]);
            }
        }
        if (data.versions){
            var split = data.versions.split(",");
            data.versions = [];
            for (var i = 0; i < split.length; i++){
               data.versions.push(split[i]);
            }
        }
        if (data.transcriptions){
            var split = data.transcriptions.split(",");
            data.transcriptions = [];
            for (var i = 0; i < split.length; i++){
               data.transcriptions.push(split[i]);
            }
        }
        if (data.resources) {
            var split = data.resources.split(",");
            data.resources = [];
            for (var i = 0; i < split.length; i++){
               data.resources.push(split[i]);
            }
        }
        if (data.images){
            var split = data.images.split(",");
            data.images = [];
            for (var i = 0; i < split.length; i++){
               data.images.push(split[i]);
            }
        }
        if (data.facsimiles){
            var split = data.facsimiles.split(",");
            data.facsimiles = [];
            for (var i = 0; i < split.length; i++){
               data.facsimiles.push(split[i]);
            }
        }
        if (data.places){
            var split = data.places.split(",");
            data.places = [];
            for (var i = 0; i < split.length; i++){
               data.places.push(split[i]);
            }
        }
        if (data["_wysihtml5_mode"]){
            delete data["_wysihtml5_mode"];
        }
        var locked = data.locked || false;
        jQuery.ajax({
          type: type,
          data: JSON.stringify(data),
          url: url,
          success: function(d){
            var project = jQuery('#metadata').data('project');
            jQuery('#alerts').append(
                jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button>'
                    + '<h4>Successfully saved ' + apiType + '</h4>'
                    + '<p><a href="/' + modulePrefix + '/' + apiType + 's' + (project? '?project='+project : '') +'">View ' + apiType + 's</a></p></div>').alert());
                if (d){
                    existingId = d.id;
                    jQuery('#metadata').data('existingid',d.id);
                }
                updateUILocked(locked);
                // load new page URI (because we have an id for the new object)
                if (newObject){
                   document.location.href= '/' + modulePrefix + "/" + apiType + 's/edit/'  + existingId;
                }
          }
        });
    }
    function updateUILocked(locked){
        // update UI editability to reflect locked/unlocked state
        var inputs = jQuery('#create-object')
            .find('fieldset:not(:last)')
            .find('input, textarea');
        inputs.attr('readonly',locked)
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
        })
        
        
    }
    function loadRelatedMVDs(id){
        jQuery.ajax({
            url: '/' + modulePath + '/api/mvds/?q=' + id,
            success: function(d){
                if (d.results.length > 0) {
                    var result = "<h4>VIEW MVD:</h4><form class='form-inline' onsubmit='return false;'><select id='mvdselect'>";
                    var res = "";
                    for (var i = 0; i < d.results.length; i++){
                        res = d.results[i];
                        var refreshURL = '/collationtools/sendtomvd/';
                        for (var j = 0; j < res.resources.length; j++){
                            var resData = res.resources[j];
                            refreshURL += (resData.id? resData.id : resData) + ';'
                        }
                        refreshURL += '?docpath=' + res.name;
                        result += '<option data-refresh="' + refreshURL + '" value="' + res.name + '">' + decodeURIComponent(res.name) + '</option>';
                        
                    }
                    result+= '</select>'
                        + '<button id="comparebtn" class="btn btn-small">Compare</button>'
                        + '<button id="tablebtn" class="btn btn-small">Table</button>'
                        + '<button id="refreshbtn" class="btn btn-small">Refresh</button>'
                        + '</form>';
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
        if (docpath) {
            // TODO actually select this resource
            document.location.href = "/collationtools/compare#" + encodeURIComponent(docpath);
        }
    }
    function viewTable(){
        var docpath = jQuery('#mvdselect').val();
        if (docpath) {
            // TODO actually select this resource
            document.location.href = "/collationtools/apparatus#" + encodeURIComponent(docpath);
        }
    }
    function refreshMVD(){
        var refreshURL = jQuery('#mvdselect').find('option:selected').data('refresh');
        if (refreshURL) {
            jQuery('#viewmvd').append("Refreshing MVD, please wait...");
            document.location.href = refreshURL;
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
                    elem.html(templates.placeCompact(d));
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
                if (template && template == "summary"){
                    elem.html(templates.resourceSummary(d));
                } else if (template == "image"){
                    elem.html(templates.imageEmbed(d));
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
            var mapquest = L.tileLayer(mapquestUrl, {maxZoom: 18, subdomains: subDomains}).addTo(map);
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
                  if (template && template == 'summary'){
                      elem.html(templates.artefactSummary(d));
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
                if (template && template == 'summary'){
                    elem.html(templates.versionSummary(d));
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
                if (template && template == 'summary'){
                    elem.html(templates.agentSummary(d));
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
                if (template && template == 'summary'){
                    elem.html(templates.eventSummary(d));
                }
              }
            });
        });
        
    }
    function enablePopups(context){
        var context = context? jQuery(context).find('.obj > h4 > a') : jQuery('.obj > h4 > a');
        console.log("enable popups",context)
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
          jQuery('#pager').append(jQuery("<button class='btn'><i class='icon-chevron-left'></i></button>").click(function(){
            loadObjects(page-1, filterTerm);
         }));
       }
       for (i = startIndex; i < endIndex; i++){
          var cls = "btn pagebtn";
          if (i == page){
            cls += " btn-highlight";
          }
          jQuery('#pager').append("<button class='" + cls + "'>" + (i + 1) + "</button>");
          
       }
       jQuery('.pagebtn').click(function(){
           var pageNum = parseInt(jQuery(this).html() - 1);
           loadObjects(pageNum,filterTerm);
       });
       if(numPages > endIndex){
           jQuery('#pager').append(jQuery("<button class='btn'><i class='icon-chevron-right'></i></button>").click(function(){
              loadObjects(page+1, filterTerm);
           }));
       }
    }
    
})();