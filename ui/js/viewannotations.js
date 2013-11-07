(function($) {
	function lookupElementByXPath(path) {
		path = path.substring(30);
    	console.log(path);
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
	
	annotationView.display = function(resURI){
        jQuery.ajax({
            url : '/lorestore/oa/?matchval=' + resURI + '&asTriples=false',
            type : 'GET',
            contentType : "application/rdf+xml",
            success : function(res) {
            	console.log("got annotations",res)
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
                
                for (var i = 0; i < annotations.length; i++) {                    
                	imgs[i] = jQuery("<img></img>");
                	imgs[i].attr('id', 'Annotation_' + annotations[i].annotationID).addClass('textAlignment');
                	
                	imgs[i].attr('style', 'cursor: pointer;');
                	imgs[i].attr('height', '16');
                	imgs[i].attr('width', '16');
                	imgs[i].attr('objectUrl', annotations[i].objectUrl);
                	imgs[i].attr('src', '/sites/all/modules/austese_repository/ui/img/link_black.png');
                	imgs[i].attr('startOffset', annotations[i].startOffset);
                	imgs[i].attr('startOffsetXpath', annotations[i].startOffsetXpath);
                	imgs[i].attr('endOffset', annotations[i].endOffset);
                	imgs[i].attr('endOffsetXpath', annotations[i].endOffsetXpath);
                	
                	$("<img index='" + i + "' src='" + annotations[i].src + "' />")
                		.attr("src", annotations[i].src)
                		.one('load', function() {
                            var annotation = annotations[this.attributes.index.value];
                            
                            var containerDiv = jQuery("#resourceContent")[0];
                            
                        	var startElement = lookupElementByXPath(annotation.startOffsetXpath);
                        	var endElement = lookupElementByXPath(annotation.endOffsetXpath);
                			        
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
                            
                    		var origWidth = this.width;
                    		var origHeight = this.height;
                            var div = $("<div></div>");
                            
                            div.width(origWidth * annotation.w / 100.0);
                            div.height(origHeight * annotation.h / 100.0);
                            div.css("background-image", "url(" + this.src + ")");
                            div.css("background-repeat","no-repeat");
                            div.css("background-position", "-" + (origWidth * annotation.x / 100.0) + "px" 
                            		+ " -" + (origHeight * annotation.y / 100.0) + "px");

                            var anchor = $("<a href='/repository/resources/" + this.src.substring(this.src.lastIndexOf("/") + 1) + "'></a>");
                            anchor.append(div);
                            
                            var div2 = $("<div><img src='/sites/all/modules/austese_repository/ui/img/double_quote_left.png'/>" + selectedText 
                            		+ "<img src='/sites/all/modules/austese_repository/ui/img/double_quote_right.png'/></div>");
                            div2.width(origWidth * annotation.w / 100.0);
                            div2.height(origHeight * annotation.h / 100.0);
                            div2.css("padding-right","14px");
                            div2.append(anchor);
                            
                            imgs[this.attributes.index.value].popover({
                        		header: '12345', 
                        		placement: 'left',
                        		trigger: 'manual',
                        		html: true,
                        		template: '<div onmouseover="'
                        			+		'if (jQuery(\'[selected=selected]\').length == 0) {'
                        			+		'clearTimeout(timeoutObj);jQuery(this).mouseleave(function() {'
                        			+		'var ref = jQuery(this); clearTimeout(timeoutObj); '
                        			+		'timeoutObj = setTimeout(function(){ref.hide();}, 300);});}" '
                        			+		'class="popover">'
                        			+ '<div class="arrow"></div>'
                        			+ '<div class="popover-inner">' 
                        			+ 	'<div class="popover-content" style="height: 190px; overflow: auto;">'
                        			+		'<p></p>'
                        			+	'</div>'
                        			+ '</div></div>',
                        		content: div2
                        	}).mouseenter(function(e) {
                        		if (jQuery('[selected=selected]').length == 0) {
                        			var ref = jQuery(this);
                            		if (!this.selected) {
                            			ref.popover('show');
                            		}
                        		}
                            }).mouseleave(function(e) {
                            	var ref = jQuery(this);
                            	if (!this.selected) {
                            		timeoutObj = setTimeout(function(){
                            			ref.popover('hide');
                                	}, 100);
                            	}
                            });
                		}
                	);
                	
                	imgs[i].click(function(){
                		if (this.selected == true) {
                			jQuery(this).removeAttr("selected")
                			this.src = '/sites/all/modules/austese_repository/ui/img/link_black.png';
                			this.selected = false;
                		} else {
                    		if (jQuery('[selected=selected]').length == 0) {
                    			jQuery(this).attr("selected","selected")
                				this.src = '/sites/all/modules/austese_repository/ui/img/link_yellow.png';
                				this.selected = true;
                    		}
                		}
                	});
                	
                    jQuery('#annotationView').append(imgs[i]);
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