jQuery(document).ready(function() {
    var metadata = jQuery('#metadata');
    var modulePath =  metadata.data('modulepath');
    var project = metadata.data('project');
    var editable = metadata.data('editable');
    var eventSummary = new Ext.XTemplate(
        '<div class="obj">',
        '<tpl for="agents"><tpl if="xindex == 1"><br/>({[xcount]} associated participant{[xcount != 1? "s" : ""]})</tpl></tpl>',
        '<tpl for="artefacts"><tpl if="xindex == 1"><br/>(Produced {[xcount]} artefact{[xcount != 1? "s" : ""]})</tpl></tpl>',
        '<tpl for="events"><tpl if="xindex == 1"><br/>({[xcount]} associated sub-event{[xcount != 1? "s" : ""]})</tpl></tpl>',
        '<p><a href="/{modulePrefix}/events/{id}{projParam}" style="font-size:smaller">VIEW</a>',
        '<tpl if="hasEditPermission">',
            '&nbsp;&nbsp;<a href="/{modulePrefix}/events/edit/{id}{projParam}" style="font-size:smaller">EDIT</a>',
        '</tpl>',
        '</p>',
        '</div>'
    );
    var dummyDate = {
            "startDate":"2011,12,10",
            "endDate":"2011,12,11",
            "headline":"Headline Goes Here",
            "text":"<p>Body text goes here, some HTML is OK</p>",
            "tag":"This is Optional",
            "classname":"optionaluniqueclassnamecanbeaddedhere",
            "asset": {
                "media":"http://twitter.com/ArjunaSoriano/status/164181156147900416",
                "thumbnail":"optional-32x32px.jpg",
                "credit":"Credit Name Goes Here",
                "caption":"Caption text goes here"
            }
        };
    var dummyEra = {
            "startDate":"2011,12,10",
            "endDate":"2011,12,11",
            "headline":"Headline Goes Here",
            "text":"<p>Body text goes here, some HTML is OK</p>",
            "tag":"This is Optional"
        }
    var timelineData = {
        "timeline":
        {
            "headline":"Timeline of Events" + (project? " for " + project : ""),
            "type":"default",
            "date": [],
            "era": []
        }
    };
    jQuery.ajax({
        type: 'GET',
        url: '/' + modulePath + '/api/events/' + (project? "?project=" + project : ""),
        dataType: "json",
        headers: {
            'Accept': 'application/json'
        },
        success: function(result){
            jQuery(result.results).each(function(i,e){
                e.modulePrefix = 'repository';
                e.hasEditPermission = editable;
                var eventData = {
                    headline: e.description + (e.eventType? " (" + e.eventType  + ")": ""),
                    text: eventSummary.apply(e),
                    startDate: e.startDate
                };
                // FIXME: parse dates
                if (e.endDate && jQuery.isNumeric(e.endDate)) {
                    eventData.endDate=e.endDate;
                }

                timelineData.timeline.date.push(eventData);
                
            });
            createStoryJS({
                type:       'timeline',
                height:     '400',
                source:     timelineData,
                embed_id:   'canvas'
            });
        }
    });

});