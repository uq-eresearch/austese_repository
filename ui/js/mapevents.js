

jQuery(document).ready(function(){
    var eventSummary = new Ext.XTemplate(
            '<div class="obj">',
            '<b><a href="/{modulePrefix}/events/{id}{projParam}">{description}<tpl if="eventType"> ({eventType})</tpl></a></b><br/>',
            '<tpl if="startDate">{startDate} &ndash; </tpl>',
            '<tpl if="endDate">{endDate}</tpl>',
            '<tpl for="agents"><tpl if="xindex == 1"><br/>({[xcount]} associated participant{[xcount != 1? "s" : ""]})</tpl></tpl>',
            '<tpl for="artefacts"><tpl if="xindex == 1"><br/>(Produced {[xcount]} artefact{[xcount != 1? "s" : ""]})</tpl></tpl>',
            '<tpl for="events"><tpl if="xindex == 1"><br/>({[xcount]} associated sub-event{[xcount != 1? "s" : ""]})</tpl></tpl>',
            '<tpl if="hasEditPermission">',
                '<p><a href="/{modulePrefix}/events/edit/{id}{projParam}" style="font-size:smaller">EDIT</a></p>',
            '</tpl>',
            '</div>'
    );
    eventSummary.compile();
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
                        var popup = eventSummary.apply(e);
                        jQuery(e.places).each(function(i2, p){
                            jQuery.ajax({
                                type: 'GET',
                                url: '/' + modulePath + '/api/places/' + p,
                                dataType: "json",
                                headers: {
                                    'Accept': 'application/json'
                                },
                                success: function(placeResult){
                                    L.marker([placeResult.latitude,placeResult.longitude])
                                      .addTo(map)
                                      .bindPopup(popup)
                                    
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

     // use tiles from Mapquest
     var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
      subDomains = ['otile1','otile2','otile3','otile4']; 
    
    L.tileLayer(mapquestUrl, 
      {maxZoom: 18, subdomains: subDomains}
    ).addTo(map);
    loadEvents();
});