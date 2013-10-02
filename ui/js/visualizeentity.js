

jQuery(document).ready(function(){
    var renderFunc = function(r, n) {
        var frame, text, defaultColor;
        defaultColor = (n.nodeType == "work"? "#FBB4AE" : 
            (n.nodeType == "version"? "#B3CDE3": 
                (n.nodeType == "resource"? "#DECBE4" :
                    (n.nodeType == "artefact"? "#FED9A6": 
                        (n.nodeType == "agent"? "#CCEBC5" : 
                            (n.nodeType == "event"? "#CCCCCC" :
                            "#FFFFCC"))))));
        
        var theText = n.label || n.id;
        var rectWidth = theText.length * 3.7 + 10;
        var rectHeight = 40;
        var rounding = 5;
        frame = r.rect(0-rectWidth/2, 0 - rectHeight/2, rectWidth, rectHeight, rounding);
        text = r.text(0, 0, theText);
        text.data('nodeData',n);
        frame.attr({
            'fill': defaultColor,
            'stroke-width' : (n.hilite? '3px': '1px'),
            'stroke': (n.hilite? "#F15311" :  defaultColor)
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
        jQuery.each(edges,function(fromId, arcs){
            jQuery.each(arcs,function(toId, config){
                g.addEdge(fromId,toId, config);
            });
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
        jQuery('#loadingvis').hide();
    };
    var showEdges = function(depth, fromId, coll, type, label, skipInverse){
        jQuery(coll).each(function(i,a){
            // allow a to be either an id or an object
            var toId = a;
            if (a.id){
                toId = a.id;
            }
            // don't add more nodes if we have reached maxDepth
            if (!processed[toId] && depth <= maxDepth){
                numberInQ++;
                loadObject(type, toId, depth + 1);
                if (!skipInverse){
                    numberInQ++;
                    getInverseRelationships(type, toId, depth + 1);
                }
            }
            // only actually display edge where a label has been specified (this avoids displaying overlapping edges for inverse rels)
            if (label && (depth <= maxDepth || processed[toId])){ 
                edges[fromId] = edges[fromId] || {};
                if (edges[fromId][toId]) {
                    edges[fromId][toId].label += ", " + label;
                } else {
                    edges[fromId][toId] = {directed: (label? true: false), label: label}
                }
            }
        });
    }
    var loadObject = function(apiType, id, depth, hilite){
        jQuery.ajax({
            type: 'GET',
            url: '/' + modulePath + '/api/' + apiType + 's/' + id,
            dataType: "json",
            headers: {
                'Accept': 'application/json'
            },
            error : function (r){
                numberInQ--;
                if (!processed[id]){
                    processed[id] = true;
                    nodes.push([id,{
                        nodeType: apiType,
                        label: "[" + apiType.toUpperCase() + "]\n" + r.statusText,
                        render: renderFunc
                    }]);
                }
                if (numberInQ == 0) {
                    drawGraph();
                }
            },
            success: function(result){
                var project = jQuery('#metadata').data('project');
                if (project) {
                    result.projParam = "?project="+ project;
                }
                if (!processed[id]) {
                    processed[id] = true;
                    var nodeLabel = "[" + apiType.toUpperCase() + "]\n" 
                        + (result.name || result.source || result.title || result.filename || result.eventType ||  result.versionTitle || result.workTitle || (result.lastName? result.lastName + ", " + result.firstName: undefined) || "Untitled");
                    if (nodeLabel.length > 35){
                        nodeLabel = nodeLabel.substr(0,32) + "...";
                    } 
                    var nodeData = {
                        nodeType: apiType,
                        label: nodeLabel,
                        render: renderFunc
                    };
                    if (hilite){
                        nodeData.hilite = true;
                    }
                    nodes.push([id,nodeData]);
                
                    var label;
                    if (result.versions){
                        switch (apiType) {
                            case "version": label = "has_part"; break;
                            case "work": label = "realised_by"; break;
                            default: label = "has_version"; break;
                        }
                        showEdges(depth, id, result.versions,"version",label);
                    }
                    if (result.places) {
                        label = "has_place";
                        showEdges(depth, id, result.places,"place",label);
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
                            showEdges(depth, id, result[key], "agent", label);
                        }
                    });
                    
                    if (result.artefacts){
                        switch (apiType) {
                            case "artefact": label = "has_part"; break;
                            case "event": label = "produces"; break;
                            case "version": label = "appears_in"; break;
                            default: label = "has_artefact";
                        }
                        showEdges(depth, id, result.artefacts,"artefact", label);
                    }
                    // events
                    if (result.events) {
                        if (apiType == "event"){
                            label = "has_sub_event";
                        } else {
                            label = "has_event";
                        }
                        showEdges(depth, id, result.events, "event", label);
                    }
                    if (result.images){
                        label = "has_image";
                        showEdges(depth, id, result.images, "resource", label);
                    }
                    // resources
                    if (result.transcriptions) {
                        if (apiType == "version") {
                            label = "is_embodied_by";
                        } else {
                            label = "has_digital_surrogate"; 
                        }
                        showEdges(depth, id, result.transcriptions,"resource",label);
                    }
                    if (result.facsimiles) {
                        label = "has_digital_surrogate";
                        showEdges(depth, id, result.facsimiles,"resource",label);
                    }
                } 
                
               
                numberInQ--;
                if (numberInQ == 0) {
                    drawGraph();
                }
            }
        });
    };
    
    function getInverseRelationships(apiType, id, d){
        function processInverseRelationships(depth,queryApiType, queryField, queryId, label) {
            jQuery.ajax({
                type: 'GET',
                url: '/' + modulePath + '/api/' + queryApiType + 's/',
                data: {
                    query: queryId,
                    searchField: queryField
                },
                dataType: "json",
                headers: {
                    'Accept': 'application/json'
                },
                error : function (r){
                    numberInQ--;
                    if (numberInQ == 0) {
                        drawGraph();
                    }
                },
                success: function(result){
                    numberInQ--;
                    if (result.count > 0){
                        // don't display label otherwise it will overlap with existing label
                        showEdges(depth, queryId, result.results, queryApiType,"", true);
                    }
                    if (numberInQ == 0) {
                        drawGraph();
                    }
                }
            });
        }
        numberInQ--;
        // inverse label names aren't displayed, only used for linking to object to grow the network
        if (apiType == "artefact"){
            // artefacts are linked to from versions, events and artefacts
            numberInQ += 3;
            processInverseRelationships(d,"version","artefacts",id, "");
            processInverseRelationships(d,"event","artefacts",id,""); 
            processInverseRelationships(d,"artefact","artefacts",id, "");
        } else if (apiType == "version") {
            // versions are linked to from works and versions
            numberInQ+=2;
            processInverseRelationships(d,"version","versions",id, "");
            processInverseRelationships(d,"work","versions", id, "");
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
                processInverseRelationships(d,"event", key, id, elabel);
                
             });
        } else if (apiType == "resource"){
            numberInQ+=3;
            processInverseRelationships(d,"version","transcriptions",id, "");
            processInverseRelationships(d,"artefact","facsimiles",id, "");
            processInverseRelationships(d,"artefact","transcriptions",id, "");
            processInverseRelationships(d,"agent","images",id, "");
        } else if (apiType == "place"){
            numberInQ+=2;
            processInverseRelationships(d,"event","places",id, "");
            processInverseRelationships(d,"version","places",id,"");
        } else if (apiType == "event"){
            numberInQ++;
            processInverseRelationships(d,"event","events",id,"");
        }
        if (numberInQ == 0) {
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
    var edges = {}; // collects edges connecting nodes to be visualised
    var maxDepth = 2;
    var numberInQ = 2; // used to determine when to draw graph - represents number of outstanding ajax requests
    loadObject(apiType, id, 0, true);
    getInverseRelationships(apiType, id, 0);
});