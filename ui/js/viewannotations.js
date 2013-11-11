function lookupElementByXPath(path) {
	path = path.substring(30);
    var paths = path.split('/');
    var node = jQuery("#resourceContent")[0];
    var returnNode = null;
    
    if (node.children[0].tagName == "PRE" && node.children[0].id == "textContainer") {
    	node = node.children[0];
    }
    
    for (var i = 0; i < paths.length; i++) {
        if (paths[i] != "") {
            var patt1 = "\\[\\d*\\]";
            var index = -1;
            if (paths[i].match(patt1)) {
                index = paths[i].match(patt1)[0];
                index = parseInt(index.substring(1, index.length - 1));
            }

            var patt2 = ".*\\[";
            var tagname = -1;
            if (paths[i].match(patt2)) {
                tagname = paths[i].match(patt2)[0];
                tagname = tagname.substring(0, tagname.length - 1);
            }

            var children = node.childNodes;

            if (tagname == "text()") {
                for (var j = 0; j < children.length; j++) {
                    if (!children[j].tagName) {
                        if (index == 1) {
                            node = children[j];
                            returnNode = node;
                            j = children.length;
                        } else {
                            index = index - 1;
                        }
                    }
                }
                if (j != (children.length + 1)) {
                    returnNode = null;
                }
            } else {
                for (var j = 0; j < children.length; j++) {
                    if (children[j].tagName && (children[j].tagName.toLowerCase() == tagname)) {
                        if (index == 1) {
                            node = children[j];
                            returnNode = node;
                            j = children.length;
                        } else {
                            index = index - 1;
                        }
                    }
                }
                if (j != (children.length + 1)) {
                    returnNode = null;
                }
            }
        }
    }
    return returnNode;
}

function getSelectionOffset(startOffset, startElement, endOffset, endElement) {			
	var containerDiv = jQuery("#resourceContent")[0];
	var range = rangy.createRange();

	range.selectNodeContents(containerDiv);
	if (startElement != containerDiv || endElement != containerDiv) {
			range.setStart(startElement, parseInt(startOffset));
			range.setEnd(endElement, parseInt(endOffset));
	}
	
	var markerTextChar = "\ufeff";
    var markerTextCharEntity = "&#xfeff;";
    var markerEl;
    var markerId = "sel_" + new Date().getTime() + "_"
            + Math.random().toString().substr(2);

    markerEl = document.createElement("span");
    markerEl.id = markerId;
    markerEl.appendChild(document.createTextNode(markerTextChar));
    range.insertNode(markerEl);

    var verticalOffset = markerEl.offsetTop;
    var parent = markerEl.parentNode;
    parent.removeChild(markerEl);
    parent.normalize();
    
    return verticalOffset;
}

function highlightText(startOffset, startOffsetXpath, endOffset, endOffsetXpath) {
	var containerDiv = jQuery("#resourceContent")[0];
    
	var startElement = lookupElementByXPath(startOffsetXpath);
	var endElement = lookupElementByXPath(endOffsetXpath);
			
    var range = rangy.createRange();
	range.selectNodeContents(containerDiv);
	if (startElement != containerDiv || endElement != containerDiv) {
			range.setStart(startElement, parseInt(startOffset));
			range.setEnd(endElement, parseInt(endOffset));
	}
    
	var sel = window.rangy.getSelection();
	
	sel.removeAllRanges();
	sel.addRange(range);
}

function preloadImage(verticalOffset, index, annotationsByVerticalOffset, imgs) {
	jQuery("<img src='" + annotationsByVerticalOffset[verticalOffset][index].annotation.src + "' />")
		.attr("src", annotationsByVerticalOffset[verticalOffset][index].annotation.src)
		.one('load', function() {
			annotationsByVerticalOffset[verticalOffset][index].width = this.width;
			annotationsByVerticalOffset[verticalOffset][index].height = this.height;
			if (annotationsByVerticalOffset[verticalOffset].length > (index + 1)) {
				preloadImage(verticalOffset, index + 1, annotationsByVerticalOffset, imgs);
			} else {
				attachToLink(verticalOffset, annotationsByVerticalOffset, imgs);
			}
	})
}

function attachToLink(verticalOffset, annotationsByVerticalOffset, imgs) {
	var divA = jQuery("<div></div>");
	
	for (var i = 0; i < annotationsByVerticalOffset[verticalOffset].length; i++) {
	    var annotation = annotationsByVerticalOffset[verticalOffset][i].annotation;
	    var startElement = annotationsByVerticalOffset[verticalOffset][i].startElement;
	    var endElement = annotationsByVerticalOffset[verticalOffset][i].endElement;
		var origWidth = annotationsByVerticalOffset[verticalOffset][i].width;
		var origHeight = annotationsByVerticalOffset[verticalOffset][i].height;
	    
	    var containerDiv = jQuery("#resourceContent")[0];
		        
		var selectedText;
		var range = rangy.createRange();
	    range.selectNodeContents(containerDiv);
	    if (startElement != containerDiv || endElement != containerDiv) {
	        range.setStart(startElement, parseInt(annotation.startOffset));
	        range.setEnd(endElement, parseInt(annotation.endOffset));
	        if (range.textRange) {
	            selectedText = range.textRange.text
	        } else {
	            selectedText = range.toString();
	        }
	    }
		
		var scale = 1.0;
		
		var newImageWidth = (origWidth * (parseFloat(annotation.x) + parseFloat(annotation.w)) / 100.0);
		if (newImageWidth > 550) {
			scale = (550 / newImageWidth);
		}
		
		origWidth = scale * origWidth;
		origHeight = scale * origHeight;
		
	    var img = jQuery("<img></img>");
	
	    img.attr("src", annotation.src);
	    img.css("display", "inline-block");
	    img.css("position", "absolute");
	    img.css("clip", "rect(" + (origHeight * annotation.y / 100.0) + "px,"
	    		+ (origWidth * (parseFloat(annotation.x) 
	    				+ parseFloat(annotation.w)) / 100.0) + "px,"
	    		+ (origHeight * (parseFloat(annotation.y) 
	    				+ parseFloat(annotation.h)) / 100.0) + "px,"
	    		+ (origWidth * annotation.x / 100.0) + "px)");
	    img.css("top", "-" + (origHeight * annotation.y / 100.0) + "px");
	    img.css("left", "-" + (origWidth * annotation.x / 100.0) + "px");
	    
	    img.height(origHeight);
	    img.width(origWidth);                            
	    
	    var anchor = jQuery("<a></a>");
	    anchor.attr("href", '/repository/resources/' + annotation.src.substring(annotation.src.lastIndexOf("/") + 1));
	    anchor.append(img);
	    
	    var divD = jQuery("<div></div>");
	    divD.css("position", "relative");
	    divD.css("width", origWidth);
	    divD.css("height", origHeight);
	    divD.append(anchor);
	    
	    var divC = jQuery("<div></div>");
	    divC.css("position", "relative");
	    divC.css("overflow", "hidden");
	    divC.css("padding-bottom", "14px");
	    divC.css("width", (origWidth * annotation.w / 100.0) + "px");
	    divC.css("height", (origHeight * annotation.h / 100.0) + "px");
	    divC.append(divD);
	    
	    var divB = jQuery("<div style='min-width: 550px'>"
	    		+ "<img onclick='jQuery(\"#popoverDiv_" + verticalOffset + "\").hide(); "
	    		+ "highlightText(" + annotation.startOffset 
	    		+ ",\"" + annotation.startOffsetXpath 
	    		+ "\"," + annotation.endOffset 
	    		+ ",\"" + annotation.endOffsetXpath + "\");' style='cursor: pointer' "
	    		+ "src='/sites/all/modules/austese_repository/ui/img/application_side_contract.png' />" 
	    		+ "<img src='/sites/all/modules/austese_repository/ui/img/double_quote_left.png'/>" + selectedText 
	    		+ "<img src='/sites/all/modules/austese_repository/ui/img/double_quote_right.png' />"
	    		+ "<br />"
	    		+ "</div>");
	    divB.width(origWidth * annotation.w / 100.0);
	    divB.height(origHeight * annotation.h / 100.0);
	    divB.css("padding-right","14px");
	    divB.append(divC);
	    
	    divA.append(divB);
	    if (i + 1 < annotationsByVerticalOffset[verticalOffset].length) {
	    	divA.append(jQuery("<br />"));
	    	divA.append(jQuery("<hr />"));
	    }
	}
	
    imgs[verticalOffset].popover({
		placement: 'left',
		trigger: 'manual',
		html: true,
		template: '<div id="popoverDiv_' + verticalOffset + '" onmouseover="'
			+		'clearTimeout(timeoutObj); jQuery(this).mouseleave(function() {'
			+		'var ref = jQuery(this); clearTimeout(timeoutObj); '
			+		'timeoutObj = setTimeout(function(){ref.hide();}, 300);});" '
			+		'class="popover" style="width:605px">'
			+ '<div class="arrow"></div>'
			+ '<div class="popover-inner" style="width:600px">' 
			+ 	'<div class="popover-content" style="height: 190px; overflow: auto;" style="width:600px">'
			+		'<p></p>'
			+	'</div>'
			+ '</div></div>',
		content: divA
	}).mouseenter(function(e) {
		var ref = jQuery(this);
		ref.popover('show');
    }).mouseleave(function(e) {
    	var ref = jQuery(this);
		timeoutObj = setTimeout(function(){
			ref.popover('hide');
    	}, 100);
    });
}

(function($) {
	annotationView.display = function(resURI){
		jQuery("#annotationView").height(jQuery("#resourceContent").height());
		
        jQuery.ajax({
            url : '/lorestore/oa/?matchval=' + resURI + '&asTriples=false',
            type : 'GET',
            contentType : "application/rdf+xml",
            success : function(res) {
                var patt1 = "#xpath=[^=#,]+,[^=#,]+#char=[0-9]+,[0-9]+$";
                var patt2 = "#xywh=[\\.0-9]+,[\\.0-9]+,[\\.0-9]+,[\\.0-9]+$";
                var patt3 = /[^=#,]+/g;
                var patt4 = /[\.0-9]+/g;
                
                var annotations = [];
                
                for ( var i = 0; i < res.childNodes.length; i++) {
                    var length = res.childNodes[i].childNodes.length;
                    for ( var j = 0; j < length; j++) {
                        if ('getElementsByTagName' in res.childNodes[i].childNodes[j]) {
                            var hasTargets = res.childNodes[i].childNodes[j]
                                    .getElementsByTagName('hasTarget');
                            if (hasTargets.length == 2) {
                                var startOffset = -1;
                                var startOffsetXpath = '';
                                var endOffset = -1;
                                var endOffsetXpath = '';
                                var x = -1;
                                var y = -1;
                                var w = -1;
                                var h = -1;
                                var src = '';
                                var pageIndex = -1;

                                var objectUrl = res.childNodes[i].childNodes[j].getAttribute('rdf:about');
                                var annotationID = objectUrl.substring(objectUrl.lastIndexOf("/") + 1);

                                var res1 = hasTargets[0]
                                        .getAttribute('rdf:resource');
                                var res2 = hasTargets[1]
                                        .getAttribute('rdf:resource');
                                
                                var matchs;
                                var numbers;
                                if (res1.match(patt1)) {
                                  matchs = res1.match(patt1);
                                  results = matchs.toString().match(patt3);
                                  if (results.length == 6) {
                                      startOffset = results[4];
                                      startOffsetXpath = results[1];
                                      endOffset = results[5];
                                      endOffsetXpath = results[2];
                                  }
                                }

                                if (res1.match(patt2)) {
                                    var res1Url = res1.substring(0, res1.indexOf("#"));
                                    if (res1.match(patt2)) {
                                        matchs = res1.match(patt2);
                                        numbers = matchs.toString()
                                                .match(patt4);
                                        if (numbers.length == 4) {
                                            x = numbers[0];
                                            y = numbers[1];
                                            w = numbers[2];
                                            h = numbers[3];

                                            src = res1Url;
                                        }
                                    }
                                }

                                if (res2.match(patt1)) {
                                    matchs = res2.match(patt1);
                                    results = matchs.toString()
                                            .match(patt3);
                                    if (results.length == 6) {
                                        startOffset = results[4];
                                        startOffsetXpath = results[1];
                                        endOffset = results[5];
                                        endOffsetXpath = results[2];
                                    }
                                }


                                if (res2.match(patt2)) {
                                    var res2Url = res2.substring(0, res2.indexOf("#"));
                                    if (res2.match(patt2)) {
                                        matchs = res2.match(patt2);
                                        numbers = matchs.toString()
                                                .match(patt4);
                                        if (numbers.length == 4) {
                                            x = numbers[0];
                                            y = numbers[1];
                                            w = numbers[2];
                                            h = numbers[3];

                                            src = res2Url;
                                        }
                                    }
                                }
                                
                                if (startOffset != -1
                                        && startOffsetXpath != ''
                                        && endOffset != -1
                                        && endOffsetXpath != '' && x != -1
                                        && y != -1 && w != -1 && h != -1) {
                                	annotations.push({"annotationID": annotationID, 
                                		"objectUrl": objectUrl, "src": src, "x": x, "y": y, "w": w, "h": h,
                                		"startOffset": startOffset, "startOffsetXpath": startOffsetXpath, 
                                		"endOffset": endOffset, "endOffsetXpath": endOffsetXpath});
                                }
                            }
                        }
                    }
                }

                var imgs = [];
                
                var annotationsByVerticalOffset = {};

                for (var i = 0; i < annotations.length; i++) {                    
                	var startElement = lookupElementByXPath(annotations[i].startOffsetXpath);
                	var endElement = lookupElementByXPath(annotations[i].endOffsetXpath);
                    var verticalOffset = getSelectionOffset(annotations[i].startOffset, startElement, annotations[i].endOffset, endElement);
                
                    if (!annotationsByVerticalOffset[verticalOffset]) {
                    	annotationsByVerticalOffset[verticalOffset] = [{
                			'annotation': annotations[i],
                			'startElement': startElement,
                			'endElement': endElement}];
                    } else {
                    	annotationsByVerticalOffset[verticalOffset].push({
                			'annotation': annotations[i],
                			'startElement': startElement,
                			'endElement': endElement});
                    }
                }
                                
                for (var verticalOffset in annotationsByVerticalOffset) {  
                	imgs[verticalOffset] = jQuery("<img></img>");
                	imgs[verticalOffset].attr('id', 'Annotation_' + verticalOffset).addClass('textAlignment');
                	
                	imgs[verticalOffset].attr('style', 'cursor: pointer; position:absolute; top: '+ verticalOffset + 'px;');
                	imgs[verticalOffset].attr('height', '16');
                	imgs[verticalOffset].attr('width', '16');
                	imgs[verticalOffset].attr('src', '/sites/all/modules/austese_repository/ui/img/link_black.png');
                	
                	preloadImage(verticalOffset, 0, annotationsByVerticalOffset, imgs);
                	
                    jQuery('#annotationView').append(imgs[verticalOffset]);
                }
            },
            error : function(xhr, testStatus, error) {
                if (console && console.log) {
                    console.log("Error occured: " + error, xhr, testStatus);
                }
            }
        });
    };
 })(jQuery);