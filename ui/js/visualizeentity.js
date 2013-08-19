

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
            'stroke': defaultColor
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
    var loadObject = function(apiType, id){
        jQuery.ajax({
            type: 'GET',
            url: '/' + modulePath + '/api/' + apiType + 's/' + id,
            dataType: "json",
            headers: {
                'Accept': 'application/json'
            },
            error : function (r){
                numberInQ--;
                nodes.push([id,{
                    nodeType: apiType,
                    label: "[" + apiType.toUpperCase() + "]\n" + r.statusText,
                    render: renderFunc
                }]);
                if (numberInQ == 0) {
                    drawGraph();
                }
            },
            success: function(result){
                depth++;
                var project = jQuery('#metadata').data('project');
                if (project) {
                    result.projParam = "?project="+ project;
                }
                nodes.push([id,{
                    nodeType: apiType,
                    label: "[" + apiType.toUpperCase() + "]\n" + (result.name || result.source || result.title || result.filename || result.eventType ||  result.versionTitle || result.workTitle || (result.lastName? result.lastName + ", " + result.firstName: undefined) || "Untitled"),
                    render: renderFunc
                }]);
                if (depth <= maxDepth) { // keep processing
                    function showEdges(coll,type, label){
                        jQuery(coll).each(function(i,a){
                            edges.push([id,a,{directed: true, label: label}]);
                            loadObject(type, a, ++numberInQ);
                        });
                    }
                    var label;
                    if (result.versions){
                        switch (apiType) {
                            case "version": label = "has_part"; break;
                            case "work": label = "realised_by"; break;
                            default: label = "has_version"; break;
                        }
                        showEdges(result.versions,"version",label);
                    }
                    if (result.places) {
                        label = "has_place";
                        showEdges(result.places,"place",label);
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
                            showEdges(result[key], "agent", label);
                        }
                        });
                    if (result.artefacts){
                        switch (apiType) {
                            case "artefact": label = "has_part"; break;
                            case "event": label = "produces"; break;
                            case "version": label = "appears_in"; break;
                            default: label = "has_artefact";
                        }
                        showEdges(result.artefacts,"artefact", label);
                    }
                    // events
                    if (result.events) {
                        if (apiType == "event"){
                            label = "has_sub_event";
                        } else {
                            label = "has_event";
                        }
                        showEdges(result.events, "event", label);
                    }
                    // resources
                    if (result.transcriptions) {
                        label = "is_embodied_by";
                        showEdges(result.transcriptions,"resource",label);
                    }
                    if (result.facsimiles) {
                        label = "has_digital_surrogate";
                        showEdges(result.facsimiles,"resource",label);
                    }
                    
                }
                numberInQ--;
                if (numberInQ == 0) {
                    drawGraph();
                }
            }
        });
    };
    var g = new Graph();
    var metadata = jQuery('#metadata');
    var modulePath =  metadata.data('modulepath');
    var project = metadata.data('project');
    var apiType =  metadata.data('apitype');
    var id = metadata.data('existingid');
    var nodes = [];
    var edges = [];
    var maxDepth = 5;
    var numberInQ = 1;
    var depth = 0;
    loadObject(apiType, id, numberInQ);
});