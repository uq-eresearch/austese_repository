<div id="alerts"></div>
<div id="newobject">
   <?php if (user_access('edit metadata')): ?>
     <a href="agents/add">+ New agent</a>
    <?php endif; ?>

</div>

<div id="resultsummary"></div>
<div id="resultcurrent"></div>

<div id="result"></div>

<div class="btn-toolbar">
    <div class="btn-group" id="pager"></div>
</div>
<script type="text/javascript">
    function loadResults(page, createPager){
      page = page || 0;
      jQuery.ajax({
       type: 'GET',
       url: '../agents/?pageSize=20&pageIndex=' + page,
       success: function(d){
         var result = eval(d);
         var rescount = parseInt(result.count);
         var numPages = Math.floor(rescount/20) + 1;
         jQuery('#resultsummary').html("Found " + result.count + " agent" + (rescount > 1? "s" : "") + ", ");
         jQuery('#resultcurrent').html("displaying page " + (page + 1) + " of " + numPages); 
         //console.log(result);
         jQuery('#result').empty();
         for (var i = 0; i < rescount; i++){
            var obj = result.results[i];
	    if (obj){		     
               var id = obj.uri.substr(obj.uri.lastIndexOf("/") + 1);
               jQuery('#result').append("<div class='obj'><h4>Name: " + obj.lastName + ", " + obj.firstName + " <a href='describeagent.html?id=" + id + "' style='font-size:smaller'>EDIT</a></h4></div>");
            }
        }
        // create pager
        if (createPager){
          var startIndex = Math.max(0,page - 5);
          var endIndex = Math.min(numPages, page+5);
          if (page <= 5){
              endIndex += 5 - page;
              endIndex = Math.min(endIndex,numPages);
          }
          jQuery('#pager').empty();
          if (startIndex > 0){
            jQuery('#pager').append(jQuery("<button class='btn'><i class='icon-chevron-left'></i></button>").click(function(){
              loadResults(page-1,true);
            }));
          }
          for (i = startIndex; i < endIndex; i++){
            var cls = "btn pagebtn";
            if (i == page){
              cls += " btn-highlight";
            }
            jQuery('#pager').append("<button class='" + cls + "'>" + (i + 1) + "</button>");
			
          }
          jQuery('.pagebtn').click(function(){
	     var pageNum = parseInt(jQuery(this).html() - 1);
             loadResults(pageNum, true);
          });
          if(numPages > endIndex){
	    jQuery('#pager').append(jQuery("<button class='btn'><i class='icon-chevron-right'></i></button>").click(function(){
		loadResults(page+1,true);
            }));
          }
	}
       }
     });

    }
    jQuery(document).ready(function(){
       jQuery('.dropdown-toggle').dropdown()
       loadResults(0,true);
    });
</script>

