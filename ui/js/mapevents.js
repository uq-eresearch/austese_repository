

jQuery(document).ready(function(){
    var eventSummary = getTemplate("eventSummary");
    var loadEvents = function(){
        jQuery.ajax({
            type: 'GET',
            url: '/' + modulePath + '/api/events/' + (id? id : "") + (project? "?project=" + project : ""),
            dataType: "json",
            headers: {
                'Accept': 'application/json'
            },
            success: function(result){
                var events;
                if (result.results){
                    events = result.results;
                } else {
                    events = [result];
                }
                jQuery(events).each(function(i,e){
                    if (e.places && e.places.length > 0){
                        e.modulePrefix = "repository";
                        if (editable) {
                            e.hasEditPermission = true;
                        }
                        if (project) {
                            e.projParam = "?project="+ project;
                        }
                        var popup = eventSummary(e);
                        jQuery(e.places).each(function(i2, p){
                            jQuery.ajax({
                                type: 'GET',
                                url: '/' + modulePath + '/api/places/' + p,
                                dataType: "json",
                                headers: {
                                    'Accept': 'application/json'
                                },
                                success: function(placeResult){
                                    var marker = L.marker([placeResult.latitude,placeResult.longitude]);
                                    marker.desc = popup + "<p>" + placeResult.name + ", " + placeResult.state + "</p>";
                                    map.addLayer(marker);
                                    oms.addMarker(marker);
                                }
                            });
                        });
                    }
                  
                });
                
            }
        });
    };
   
    var metadata = jQuery('#metadata');
    var modulePath =  metadata.data('modulepath');
    var project = metadata.data('project');
    var apiType =  metadata.data('apitype');
    var id = metadata.data('existingid');
    var editable = metadata.data('editable');
    
    // center map on Australia
    var map = L.map('canvas').setView([-24.994167,134.866944],3);
    var oms = new OverlappingMarkerSpiderfier(map);
    var popup = new L.Popup();
    oms.addListener('click', function(marker) {
      popup.setContent(marker.desc);
      popup.setLatLng(marker.getLatLng());
      map.openPopup(popup);
    });
    oms.addListener('spiderfy', function(markers) {
        map.closePopup();
    });
     // use tiles from Mapquest
     var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
      subDomains = ['otile1','otile2','otile3','otile4']; 
    
    L.tileLayer(mapquestUrl, 
      {maxZoom: 18, 
        attribution: 'Map imagery and data provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a> &amp; <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        subdomains: subDomains}
    ).addTo(map);
    loadEvents();
});