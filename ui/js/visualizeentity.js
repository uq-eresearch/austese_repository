

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
        var actualnodes = []
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
            success: function(result){
                depth++;
                var project = jQuery('#metadata').data('project');
                if (project) {
                    result.projParam = "?project="+ project;
                }
                nodes.push([id,{
                    nodeType: apiType,
                    label: "[" + apiType.toUpperCase() + "]\n" + (result.name || result.source || result.title || result.filename || result.eventType || (result.lastName + ", " + result.firstName)|| result.versionTitle || "Untitled"),
                    render: renderFunc
                }]);
                if (depth <= maxDepth) { // keep processing
                    var label;
                    if (result.versions){
                        if (apiType == "version"){
                            label = "has_part";
                        } else if (apiType == "work") {
                            label = "realised_by";
                        } else {
                            label = "";
                        }
                        jQuery(result.versions).each(function(i,v){
                            edges.push([id,v, {directed: true, label: label}]);
                            loadObject("version", v, ++numberInQ)
                        });
                    }
                    if (result.places) {
                        label = "has_place";
                        jQuery(result.places).each(function(i,a){
                            edges.push([id,a,{directed: true, label: label}]);
                            loadObject("place", a, ++numberInQ)
                        });
                    }
                    if (result.agents) {
                        label = "has_participant";
                        jQuery(result.agents).each(function(i,a){
                            edges.push([id,a,{directed: true, label: label}]);
                            loadObject("agent", a, ++numberInQ)
                        });
                    }
                    if (result.artefacts){
                        if (apiType == "artefact"){
                            label = "has_part";
                        } else if (apiType == "event") {
                            label = "produces";
                        } else if (apiType == "version"){
                            label = "appears_in";
                        } else {
                            label = "";
                        }
                        jQuery(result.artefacts).each(function(i,a){
                            edges.push([id,a,{directed: true, label: label}]);
                            loadObject("artefact", a, ++numberInQ)
                        });
                    }
                    if (result.events) {
                        if (apiType == "event"){
                            label = "has_sub_event";
                        } else {
                            label = "has_event";
                        }
                        jQuery(result.events).each(function(i,a){
                            edges.push([id,a,{directed: true, label: label}]);
                            loadObject("event", a, ++numberInQ)
                        });
                    }
                    if (result.transcriptions) {
                        label = "is_embodied_by";
                        jQuery(result.transcriptions).each(function(i,a){
                            edges.push([id,a,{directed: true, label: label}]);
                            loadObject("resource", a, ++numberInQ)
                        });
                    }
                    if (result.facsimiles) {
                        label = "has_digital_surrogate";
                        jQuery(result.facsimiles).each(function(i,a){
                            edges.push([id,a,{directed: true, label: label}]);
                            loadObject("resource", a, ++numberInQ)
                        });
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