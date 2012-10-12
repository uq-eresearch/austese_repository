<div id="alerts"></div>
<form id="create-work" class="form-horizontal">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="workTitle">Title</label>
      <div class="controls">
        <input name="workTitle" type="text" class="input-xlarge" id="workTitle">

        <p class="help-block">Full title of the work</p>
      </div>
    </div>

    <div class="control-group">
      <label class="control-label" for="name">Name</label>
      <div class="controls">
        <input name="name" type="text" class="input-xlarge" id="name">
        <p class="help-block">Short name for the work</p>
      </div>
    </div>

  <div class="control-group">
      <label class="control-label" for="versions">Versions</label>
      <div class="controls">
        <input name="versions" type="text" class="input-xlarge" id="versions">
        <p class="help-block">Versions of this work</p>
      </div>
    </div>

    <div class="control-group">
<div class="controls">
    <input type="button" class="btn" onclick="onSave()" value="Save">
    <input id="del-btn" style="display:none" type="button" class="btn btn-danger" onclick="onDelete()" value="Delete">
</div></div>
  </fieldset>
</form>

<script type="text/javascript" src="js/jquery.tokeninput.js"></script>

  <script type="text/javascript">
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
    }
    jQuery(document).ready(function(){
       jQuery('.dropdown-toggle').dropdown()
       var existing = getURLParameter("id");
       if (existing) {
        loadObject(existing);
        jQuery('#del-btn').css('display','inline');
       }
       jQuery("#versions").tokenInput("/content/versions/", {
                theme: "facebook",
                tokenValue: "id",
	        hintText: "Start typing to search versions by title",
                jsonContainer: "results",
                propertyToSearch: "versionTitle",
                resultsFormatter: function(item){return "<li><b>"+item.versionTitle + "</b>, " + item.name + ", " + item.date + "<br/>"+item.firstLine;},
	        tokenFormatter: function(item){return "<li>" + item.versionTitle + ", " + item.name + ", " + item.date + "</li>";}
       });
    });
    function loadObject(id){
       jQuery.ajax({
          url: '../works/'+ id,
          success: function(d){
             js2form(document.getElementById('create-work'),d);
             if (d.versions){
               for (var i = 0; i < d.versions.length; i++){
                jQuery.ajax({
                  type: 'GET',
                  url: '../versions/' + d.versions[i],
                  success: function(v){
                    jQuery('#versions').tokenInput("add",v);
                  }
                });
               }
             }
          }
       });
    }
    function onDelete(){
      var existing = getURLParameter("id");
      jQuery.ajax({
         type: 'DELETE',
         url: '../works/' + existing,
         success: function(d){
           jQuery('#alerts').append(jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button><h4>Work deleted</h4><p><a href="#" onClick="onSave()">Undo</a></p><p><a href="works.html">View works</a></p></div>').alert());
         }
      });
    }
    function onSave(){
     var existing = getURLParameter("id");
     var type = 'POST';
     var url = '../works/';
     if (existing) {
        type = 'PUT';
        url += existing;
     }
     var data = jQuery('#create-work').serializeObject();
     if (data.versions){
       var split = data.versions.split(",");
       data.versions = [];
       for (var i = 0; i < split.length; i++){
          data.versions.push(split[i]);
       }
     }
     jQuery.ajax({
       type: type,
       data: JSON.stringify(data),
       url: url,
       success: function(d){
         jQuery('#alerts').append(jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button><h4>Work saved</h4><p><a href="works.html">View works</a></p></div>').alert());
       }
     });
    };
jQuery.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    jQuery.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
  </script>

