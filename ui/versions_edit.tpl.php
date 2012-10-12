<div id="alerts"></div>
<form id="create-version" class="form-horizontal">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="versionTitle">Title</label>
      <div class="controls">
        <input name="versionTitle" type="text" class="input-xlarge" id="versionTitle">

        <p class="help-block">Title for the version</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="date">Date</label>
      <div class="controls">
        <input name="date" type="text" class="input-xlarge" id="date">
        <p class="help-block">e.g. 1875</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="firstLine">First Line</label>
      <div class="controls">
        <input name="firstLine" type="text" class="input-xlarge" id="firstLine">
        <p class="help-block">First line of the version (e.g. for poetry)</p>
      </div>
    </div>
<div class="control-group">
      <label class="control-label" for="name">Name</label>
      <div class="controls">
        <input name="name" type="text" class="input-xlarge" id="name">
        <p class="help-block">Short name for version</p>
      </div>
    </div>

    <div class="control-group">
      <label class="control-label" for="artefacts">Artefacts</label>
      <div class="controls">
        <input name="artefacts" type="text" class="input-xlarge" id="artefacts">
        <p class="help-block">Artefacts associated with this version</p>
      </div>
    </div>

    

<div class="control-group">
<div class="controls">
    <input type="button" class="btn" onclick="onSave()" value="Save">
    <input id="del-btn" style="display:none" type="button" class="btn btn-danger" onclick="onDelete()" value="Delete">
</div></div>
  </fieldset>
</form>

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
       jQuery("#artefacts").tokenInput("/content/artefacts/", {
                theme: "facebook",
                tokenValue: "id",
	        hintText: "Start typing to search artefacts by source",
                jsonContainer: "results",
                propertyToSearch: "source",
                resultsFormatter: function(item){return "<li><b>" + item.source + "</b>, " + item.date + ", " + item.bibDetails;},
	        tokenFormatter: function(item){return "<li>" + item.source + ", " + item.date + ", " + item.bibDetails + "</li>";}
       });

    });
    function loadObject(id){
       jQuery.ajax({
          url: '../versions/'+ id,
          success: function(d){
             js2form(document.getElementById('create-version'),d);
             if (d.artefacts){
               for (var i = 0; i < d.artefacts.length; i++){
                jQuery.ajax({
                  type: 'GET',
                  url: '../artefacts/' + d.artefacts[i],
                  success: function(v){
                    jQuery('#artefacts').tokenInput("add",v);
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
         url: '../versions/' + existing,
         success: function(d){
           jQuery('#alerts').append(jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button><h4>Version deleted</h4><p><a href="#" onClick="onSave()">Undo</a></p><p><a href="versions.html">View versions</a></p></div>').alert());
         }
      });
    }
    function onSave(){
     var existing = getURLParameter("id");
     var type = 'POST';
     var url = '../versions/';
     if (existing) {
        type = 'PUT';
        url += existing;
     }
     var data = jQuery('#create-version').serializeObject();
     if (data.artefacts){
       var split = data.artefacts.split(",");
       data.artefacts = [];
       for (var i = 0; i < split.length; i++){
          data.artefacts.push(split[i]);
       }

     }
     jQuery.ajax({
       type: type,
       data: JSON.stringify(data),
       url: url,
       success: function(d){
         jQuery('#alerts').append(jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button><h4>Version saved</h4><p><a href="versions.html">View versions</a></p></div>').alert());
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
