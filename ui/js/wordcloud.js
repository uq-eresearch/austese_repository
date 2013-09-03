var wordCloud = {};
(function($) {
// Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html
            // and http://www.jasondavies.com/wordcloud/
            var w = jQuery('#wordcloud').width();
            var fill = d3.scale.category20(),
                tags, 
                maxWords = 250,
                maxLength = 40,
                width = w,
                height = 550,
                wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
                punctuation = /[!"&()*+,-\.\/:;<=>?\[\\\]^`\{|\}~]+/g,
                stopWords = /^(jm|dm|aw|jg|dv|bw|yeah|yes|nw|oh|okay|well|quite|let|just|still|bit|lot|got|get|ive|im|id|i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/
              
              // helper functions
              function parseText(text) {
                tags = {};
                var cases = {};
                text.split(wordSeparators).forEach(function(word) {
                  word = word.replace(punctuation, "");
                  if (stopWords.test(word.toLowerCase())) return;
                  word = word.substr(0, maxLength);
                  cases[word.toLowerCase()] = word;
                  tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
                });
                tags = d3.entries(tags).sort(function(a, b) { return b.value - a.value; });
                tags.forEach(function(d) { d.key = cases[d.key]; });
              }
              function draw(words) {
                $('#wordcloud').empty();
                d3.select("#wordcloud").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                  .append("g")
                    .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
                  .selectAll("text")
                    .data(words)
                  .enter().append("text")
                    .style("font-size", function(d) { return  d.size + "px"; })
                    .style("font-family", "Impact")
                    .style("fill", function(d, i) { return fill(i); })
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d) {
                      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) { return d.text; });
              }
              wordCloud.drawWordCloud = function(){
                  
                  // parse the text of the transcript and get word frequencies
                  parseText($("#resourceContent").text());
                  if (console && console.log) console.log("tags",tags);
                  var words = tags.slice(0, max = Math.min(tags.length, + maxWords));
                  
                  // draw the tag cloud
                  d3.layout.cloud().size([width, height])
                      .words(words.map(function(d) {
                        return {text: d.key, size: 15 + (d.value * 1.4)};
                      }))
                      .padding(5)
                      .rotate(function() { return ~~(Math.random() * 2) * 90; })
                      .font("Impact")
                      .fontSize(function(d) { return d.size; })
                      .on("end", draw)
                      .start();
                  if ($('#wordcloud > svg').length == 0){
                      draw();
                  }
              };
 })(jQuery);