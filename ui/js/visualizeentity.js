

jQuery(document).ready(function(){
    var renderFunc = function(r, n) {
        var frame, text, defaultColor;
        defaultColor = (n.nodeType == "work"? "#FBB4AE" : 
            (n.nodeType == "version"? "#B3CDE3": 
                (n.nodeType == "resource"? "#DECBE4" :
                    (n.nodeType == "artefact"? "#FED9A6": 
                        (n.nodeType == "agent"? "#CCEBC5" : 
                            "#FFFFCC")))));
        
        var theText = n.label || n.id;
        frame = r.ellipse(0, 0, theText.length * 3.5, 20);
        text = r.text(0, 0, theText);
        text.data('nodeData',n);
        frame.attr({
            'fill': n.color || defaultColor,
            'stroke-width' : '1px',
            'stroke': n.color || defaultColor
        });
        text.click(function(){
            var nodeData = this.data("nodeData");
            document.location.href = '/repository/' + nodeData.nodeType + 's/' + nodeData.id + 
                (project? "?project=" + project : ""); 
        });
        var set = r.set()
          .push(frame, text);
        return set;
    };
    var drawGraph = function(){
        var actualnodes = [];
        jQuery(nodes).each(function(i,n){
            actualnodes.push(g.addNode(n[0],n[1]));
        });
        // FIXME: fan or combine edges between the same nodes
        jQuery(edges).each(function(i,e){
            g.addEdge(e[0],e[1], e[2]);
        });
        var layouter = new Graph.Layout.Spring(g);
        layouter.layout();
        var width = jQuery('#canvas').width();
        var renderer = new Graph.Renderer.Raphael('canvas', g, width, 600);
        // adjust to fix layout for single node diagrams
        if (actualnodes.length ==  1) {
            actualnodes[0].shape.translate(200,100);
        }
        renderer.draw();
    };
    var showEdges = function(fromId, coll, type, label, skipInverse){
        jQuery(coll).each(function(i,a){
            // allow a to be either an id or an object
            var toId = a;
            if (a.id){
                toId = a.id;
            }
            // only actually display edge where a label has been specified (this avoids displaying overlapping edges for inverse rels)
            //if (label){ 
                edges.push([fromId,toId,{directed: (label? true: false), label: label}]);
            //}
            if (!processed[toId]){
                numberInQ++;
                loadObject(type, toId);
                if (!skipInverse){
                    numberInQ++;
                    getInverseRelationships(type, toId);
                }
            }
        });
    }
    var loadObject = function(apiType, id, hilite){
        jQuery.ajax({
            type: 'GET',
            url: '/' + modulePath + '/api/' + apiType + 's/' + id,
            dataType: "json",
            headers: {
                'Accept': 'application/json'
            },
            error : function (r){
                numberInQ--;
                processed[id] = true;
                nodes.push([id,{
                    nodeType: apiType,
                    label: "[" + apiType.toUpperCase() + "]\n" + r.statusText,
                    render: renderFunc
                }]);
                if (numberInQ == 0) {
                    console.log("drawing graph after error load object")
                    drawGraph();
                }
            },
            success: function(result){
                depth++;
                var project = jQuery('#metadata').data('project');
                if (project) {
                    result.projParam = "?project="+ project;
                }
                processed[id] = true;
                var nodeData = {
                    nodeType: apiType,
                    label: "[" + apiType.toUpperCase() + "]\n" + (result.name || result.source || result.title || result.filename || result.eventType ||  result.versionTitle || result.workTitle || (result.lastName? result.lastName + ", " + result.firstName: undefined) || "Untitled"),
                    render: renderFunc
                };
                if (hilite){
                    nodeData.color = "#e7e7e7";
                }
                nodes.push([id,nodeData]);
                if (depth <= maxDepth) { // keep processing
                    var label;
                    if (result.versions){
                        switch (apiType) {
                            case "version": label = "has_part"; break;
                            case "work": label = "realised_by"; break;
                            default: label = "has_version"; break;
                        }
                        showEdges(id, result.versions,"version",label);
                    }
                    if (result.places) {
                        label = "has_place";
                        showEdges(id, result.places,"place",label);
                    }
                    // all of the different agent roles for events
                    ["agents", "authors", "amanuenses", "influencers", "editors", "publishers",
                     "printers", "compositors", "illustrators", "binders", "readers", "translators",
                     "booksellers"].forEach(function(key){
                        if (result[key]){
                            switch (key) {
                                case "amanuenses": label = "has_amanuensis"; break;
                                default: label = "has_" + key.substr(0, key.length - 1);
                            }
                            showEdges(id, result[key], "agent", label);
                        }
                    });
                    
                    if (result.artefacts){
                        switch (apiType) {
                            case "artefact": label = "has_part"; break;
                            case "event": label = "produces"; break;
                            case "version": label = "appears_in"; break;
                            default: label = "has_artefact";
                        }
                        showEdges(id, result.artefacts,"artefact", label);
                    }
                    // events
                    if (result.events) {
                        if (apiType == "event"){
                            label = "has_sub_event";
                        } else {
                            label = "has_event";
                        }
                        showEdges(id, result.events, "event", label);
                    }
                    if (result.images){
                        label = "has_image";
                        showEdges(id, result.images, "resource", label);
                    }
                    // resources
                    if (result.transcriptions) {
                        label = "is_embodied_by";
                        showEdges(id, result.transcriptions,"resource",label);
                    }
                    if (result.facsimiles) {
                        label = "has_digital_surrogate";
                        showEdges(id, result.facsimiles,"resource",label);
                    }
                    
                }
               
                numberInQ--;
                if (numberInQ == 0) {
                    //console.log("drawing graph after load object")
                    drawGraph();
                }
            }
        });
    };
    
    function getInverseRelationships(apiType, id){
        function processInverseRelationships(queryApiType, queryField, queryId, label) {
            jQuery.ajax({
                type: 'GET',
                url: '/' + modulePath + '/api/' + queryApiType + 's/',
                data: {
                    q: queryId,
                    searchField: queryField
                },
                dataType: "json",
                headers: {
                    'Accept': 'application/json'
                },
                error : function (r){
                    numberInQ--;
                    if (numberInQ == 0) {
                        //console.log("drawing graph after error in get inverse rels")
                        drawGraph();
                    }
                },
                success: function(result){
                    numberInQ--;
                    if (result.count > 0){
                        // don't display label otherwise it will overlap with existing label
                        showEdges(queryId, result.results, queryApiType,"", true);
                    }
                    //console.log("got inverse rels",result, numberInQ)
                    if (numberInQ == 0) {
                        //console.log("drawing graph after success in get inverse rels")
                        drawGraph();
                    }
                }
            });
        }
        numberInQ--;
        if (apiType == "artefact"){
            // artefacts are linked to from versions, events and artefacts
            numberInQ += 3;
            processInverseRelationships("version","artefacts",id, "has_version");// FIXME label name
            processInverseRelationships("event","artefacts",id,"produced_by"); // FIXME: label name
            processInverseRelationships("artefact","artefacts",id, "is_part_of");
        } else if (apiType == "version") {
            // versions are linked to from works and versions
            numberInQ+=2;
            processInverseRelationships("version","versions",id, "is_part_of");
            processInverseRelationships("work","versions", id, "has_work");//FIXME label name
        } else if (apiType=="agent"){
            ["agents", "authors", "amanuenses", "influencers", "editors", "publishers",
             "printers", "compositors", "illustrators", "binders", "readers", "translators",
             "booksellers"].forEach(function(key){
                var elabel;
                switch (key) {
                  case "amanuenses": elabel = "is_amanuensis_for"; break;
                  default: elabel = "is_" + key.substr(0, key.length - 1) + "_for";
                }
                numberInQ++;
                processInverseRelationships("event", key, id, elabel);
                
             });
        } else if (apiType == "resource"){
            numberInQ+=3;
            processInverseRelationships("versions","transcriptions",id, "is_digital_surrogate_for");
            processInverseRelationships("artefacts","facsimiles",id, "is_digital_surrogate_for");
            processInverseRelationships("agents","images",id, "is_image_for");
        } else if (apiType == "place"){
            numberInQ+=2;
            processInverseRelationships("event","places",id, "is_place_for");
            processInverseRelationships("version","places",id,"is_place_for");
        } else if (apiType == "event"){
            numberInQ++;
            processInverseRelationships("event","events",id,"has_sub_event");
        }
        if (numberInQ == 0) {
            //console.log("drawing graph from default case in get inverse rels")
            drawGraph();
        }
    }
    var g = new Graph();
    var metadata = jQuery('#metadata');
    var modulePath =  metadata.data('modulepath');
    var project = metadata.data('project');
    var apiType =  metadata.data('apitype');
    var id = metadata.data('existingid');
    var processed = {}; // keeps track of processed ids to avoid cycles
    var nodes = []; // collects nodes to be visualised
    var edges = []; // collects edges connecting nodes to be visualised
    var maxDepth = 5;
    var numberInQ = 2; // used to determine when to draw graph - represents number of outstanding ajax requests
    var depth = 0;
    loadObject(apiType, id, true);
    getInverseRelationships(apiType, id);
});