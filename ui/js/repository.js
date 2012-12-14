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
    var apiType;
    var modulePath;
    var modulePrefix;
    var hasEditPermission = false;
    var apiOperation;
    var existingId;
    jQuery(document).ready(function(){

        var metadata = jQuery('#metadata');
        // read parameters from data attributes set in the template
        apiType = metadata.data('apitype');
        apiOperation = metadata.data('apioperation');
        modulePath = metadata.data('modulepath');
        modulePrefix = metadata.data('moduleprefix');
        existingId = metadata.data('existingid');
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
        } else {
            jQuery('#save-btn').on('click',onSave);
            if (existingId) {
             loadSingleObject(existingId);
             jQuery('#del-btn').css('display','inline').on('click',onDelete);
            }
        }
        // set up search fields
        // artefacts field only present on versions edit page
        if (typeof (jQuery().tokenInput) == 'function'){
            jQuery("#artefacts").tokenInput("/content/artefacts/", {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search artefacts by source",
                jsonContainer: "results",
                propertyToSearch: "source",
                resultsFormatter: function(item){return "<li><b>" + item.source + "</b>, " + item.date + ", " + item.bibDetails;},
                tokenFormatter: function(item){return "<li>" + item.source + ", " + item.date + ", " + item.bibDetails + "</li>";}
            });
            // versions field only present on works edit page
            jQuery("#versions").tokenInput("/content/versions/", {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search versions by title",
                jsonContainer: "results",
                propertyToSearch: "versionTitle",
                resultsFormatter: function(item){return "<li><b>"+item.versionTitle + "</b>, " + item.name + ", " + item.date + "<br/>"+item.firstLine;},
                tokenFormatter: function(item){return "<li>" + item.versionTitle + ", " + item.name + ", " + item.date + "</li>";}
            });
        }
    });
    
    function loadObjects(page, filterTerm){
        page = page || 0;
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
               q: (filterTerm?  filterTerm : "")
           },
           success: function(result){
             var rescount = parseInt(result.count);
             var numPages = Math.floor(rescount/pageSize) + 1;
             jQuery('#resultsummary').html("Found " + result.count + " " + apiType + (rescount != 1? "s" : "") + (filterTerm? (" matching '" + filterTerm + "'") : "") + ", ");
             jQuery('#resultcurrent').html("displaying page " + (page + 1) + " of " + numPages); 
             jQuery('#result').empty();
             if (apiType == "artefact"){
                 displayArtefacts(pageSize, result);
             } else if (apiType == "version"){
                 displayVersions(pageSize, result);
             } else if (apiType == "work"){
                 displayWorks(pageSize, result);
             } else if (apiType == "agent"){
                 displayAgents(pageSize, result);
             } else if (apiType == "place"){
                 displayPlaces(pageSize, result);
             }
             updatePager(page, numPages, filterTerm);
           } // end success function
        });
    };
    function loadSingleObject(id){
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
           }
        });
    };
     function onDelete(){
       jQuery.ajax({
          type: 'DELETE',
          url: '/' + modulePath + '/api/' + apiType + 's/' + existingId,
          success: function(d){
            jQuery('#alerts').append(
                jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button>' 
                    + '<h4>Successfully deleted ' + apiType +'</h4><p><a id="last-minute-undo" href="javascript:void(0);">Undo</a></p>'
                    + '<p><a href="/' + modulePrefix + '/' + apiType + 's">View ' + apiType + 's</a></p></div>').alert());
                jQuery('#last-minute-undo').on('click', onSave);
          }
       });
    };
    function onSave(){
        var type = 'POST';
        var url = '/' + modulePath + '/api/' + apiType + 's/';
        if (existingId) {
           type = 'PUT';
           url += existingId;
        }
        var data = jQuery('#create-object').serializeObject();
        if (data.artefacts){
            var split = data.artefacts.split(",");
            data.artefacts = [];
            for (var i = 0; i < split.length; i++){
               data.artefacts.push(split[i]);
            }
        }
        if (data.versions){
            var split = data.versions.split(",");
            data.versions = [];
            for (var i = 0; i < split.length; i++){
               data.versions.push(split[i]);
            }
        }
        jQuery.ajax({
          type: type,
          data: JSON.stringify(data),
          url: url,
          success: function(d){
            jQuery('#alerts').append(
                jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button>'
                    + '<h4>Successfully saved ' + apiType + '</h4>'
                    + '<p><a href="/' + modulePrefix + '/' + apiType + 's">View ' + apiType + 's</a></p></div>').alert());
          }
        });
    };
    function onSaveResource(){ 
        var formData = new FormData(jQuery('#create-object')[0]);
        jQuery.ajax({
          type: 'POST',
          enctype: 'multipart/form-data',
          data: formData,
          url: '/' + modulePath + '/api/resources/',
          success: function(d){
            jQuery('#alerts').append(jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button><h4>Resource uploaded</h4><p><a href="digitalresources.html">View resources</a></p></div>').alert());
          }
        });
       };
    var updatePager = function(page, numPages, filterTerm){
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
    };
    // display functions for various types
    function displayAgents(rescount, result) {
        for (var i = 0; i < rescount; i++){
           var obj = result.results[i];
           if (obj){
               var id = obj.uri.substr(obj.uri.lastIndexOf("/") + 1);
               var markup = "<div class='obj'><h4>Name: " + obj.lastName + ", " + obj.firstName;
               if (hasEditPermission) {
                 markup += " <a href='/" + modulePrefix + "/agents/edit/" + id + "' style='font-size:smaller'>EDIT</a>";
               }
               markup += "</h4></div>";
               jQuery('#result').append(markup);
           }
        }
       
    };
    function displayPlaces(rescount, result){
        jQuery('#result').append('<p class="muted" style="clear:both">Place names taken from <a href="http://www.ga.gov.au/">Geoscience Australia</a> Gazetteer of Australia. Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.</p>');
        for (var i = 0; i < rescount; i++){
            var obj = result.results[i];
            if (obj){
                var id = obj.uri.substr(obj.uri.lastIndexOf("/") + 1);
                var markup = "<div class='span3 obj'><div class='placedesc'><h4>" + obj.name + ", " + obj.state;
                /*if (hasEditPermission) {
                  markup += " <a href='/" + modulePrefix + "/places/edit/" + id + "' style='font-size:smaller'>EDIT</a>";
                }*/
                markup += "</h4><p>Feature Type: <span class='featureCode'>" + obj.featureCode + "</span>" 
                    + "</p></div><div class='minimap' data-lat='" + obj.latitude + "' data-long='" + obj.longitude + "'></div></div>";
                jQuery('#result').append(markup);
            }
         }
         
         jQuery('.minimap').each(function(i, el){
            var lat = jQuery(el).data('lat');
            var long = jQuery(el).data('long');
            var map = L.map(el).setView([lat, long], 6);
            var marker = L.marker([lat, long]).addTo(map);
            var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
                subDomains = ['otile1','otile2','otile3','otile4']; 
            var mapquest = L.tileLayer(mapquestUrl, {maxZoom: 18, subdomains: subDomains}).addTo(map);
         });
         jQuery.ajax({
             type: 'GET',
             url: '/' + modulePath + '/api/featurecodes/',
             success: function(d){
                 console.log("got feature codes",d);
                 var codes = d.results;
                 if (codes){
                     jQuery('.featureCode').each(function(i,el){
                         var featureCode = jQuery(el).html();
                         var featureCodeDesc = codes[featureCode],
                             featureCodeShort = featureCodeDesc;
                         if (featureCodeDesc.length > 50){
                             featureCodeShort = jQuery.trim(featureCodeShort).substring(0, 50).trim(this) + "...";
                         }
                         jQuery(el).html(featureCodeShort).attr('title',featureCode + ": " + featureCodeDesc);
                     });
                 }
             }
           });
    };
    function displayArtefacts(rescount, result){
        for (var i = 0; i < rescount; i++){
           var obj = result.results[i];
           if (obj){
              var id = obj.uri.substr(obj.uri.lastIndexOf("/") + 1);
              var markup = "<div class='obj'><h4>Source: " + obj.source; 
              if (hasEditPermission) {
                markup += " <a href='/" + modulePrefix + "/artefacts/edit/" + id + "' style='font-size:smaller'>EDIT</a>"
              }
              markup += "</h4>Date: " + obj.date + "<br/>Bibliographic Details: " + obj.bibDetails + "</div>";
              jQuery('#result').append(markup);
           }
        }
    };
    function displayVersions(rescount, result){
        for (var i = 0; i < rescount; i++){
            var obj = result.results[i];
            if (obj){             
                var id = obj.uri.substr(obj.uri.lastIndexOf("/") + 1);
                var artefacts = "";
                if (obj.artefacts && obj.artefacts.length > 0){
                  artefacts += "<br/>Artefacts: ";
                  for (var j = 0; j < obj.artefacts.length; j++){
                        artefacts += "<span class='label artefact' data-artefactid='" + obj.artefacts[j] + "'></span>";
                  }
                }
                var markup = "<div class='obj'><h4>Title: " + obj.versionTitle;
                if (hasEditPermission) {
                  markup += " <a href='versions/edit/" + id + "' style='font-size:smaller'>EDIT</a>"
                }
                markup += "</h4>Date: " + obj.date 
                + "<br/>Name: " + obj.name 
                + "<br/>First line: " + (obj.firstLine || "") + artefacts + "</div>";
                jQuery('#result').append(markup);
             }
        }
        jQuery(".artefact").each(function(){
            var elem = jQuery(this);
            jQuery.ajax({
              type: 'GET',
              url: '/' + modulePath + '/api/artefacts/' + elem.data('artefactid'),
              success: function(d){
                  var markup = d.source + ", " + d.date + ", " + d.bibDetails;
                  if (hasEditPermission){
                      markup += " <a href='artefacts/edit/" + d.id + "' style='font-size:smaller'>EDIT</a>";
                  }
                  elem.html(markup);
              }
            });
        });
    };
    function displayWorks(rescount, result) {
        for (var i = 0; i < rescount; i++){
            var obj = result.results[i];
            if (obj){             
                var id = obj.uri.substr(obj.uri.lastIndexOf("/") + 1);
                var versions = "";
                if (obj.versions && obj.versions.length > 0){
                    versions += "<br/>Versions: ";
                    for (var j = 0; j < obj.versions.length; j++){
                        versions += "<span class='label version' data-versionid='" + obj.versions[j] + "'></span>";
                    }
                }
                var markup = "<div class='obj'><h4>Title: " + obj.workTitle;
                if (hasEditPermission){
                  markup += " <a href='works/edit/" + id + "' style='font-size:smaller'>EDIT</a>"
                }
                markup += "</h4>Name: " + obj.name + versions + "</div>";
                jQuery('#result').append(markup);
            }
        }
        jQuery(".version").each(function(){
          var elem = jQuery(this);
          jQuery.ajax({
            type: 'GET',
            url: '/' + modulePath + '/api/versions/' + elem.data('versionid'),
            success: function(d){
                var markup = d.versionTitle + ", " + d.name + ", " + d.date ;
                if (hasEditPermission){
                    markup += " <a href='versions/edit/" + d.id + "' style='font-size:smaller'>EDIT</a>";
                }
                elem.html(markup);
            }
          });
        });
    };
})();