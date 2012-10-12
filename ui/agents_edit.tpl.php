<div id="alerts"></div>
<form id="create-agent" class="form-horizontal">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="lastName">Last Name</label>
      <div class="controls">
        <input name="lastName" type="text" class="input-xlarge" id="lastName">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="firstName">First Name</label>
      <div class="controls">
        <input name="firstName" type="text" class="input-xlarge" id="firstName">
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
    });
    function loadObject(id){
       jQuery.ajax({
          url: '../agents/'+ id,
          success: function(d){
             js2form(document.getElementById('create-agent'),d);
          }
       });
    }
    function onDelete(){
      var existing = getURLParameter("id");
      jQuery.ajax({
         type: 'DELETE',
         url: '../agents/' + existing,
         success: function(d){
           jQuery('#alerts').append(jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button><h4>Agent deleted</h4><p><a href="#" onClick="onSave()">Undo</a></p><p><a href="agents.html">View agents</a></p></div>').alert());
         }
      });
    }
    function onSave(){
     var existing = getURLParameter("id");
     var type = 'POST';
     var url = '../agents/';
     if (existing) {
        type = 'PUT';
        url += existing;
     }
     var data = JSON.stringify(jQuery('#create-agent').serializeObject());
     jQuery.ajax({
       type: type,
       data: data,
       url: url,
       success: function(d){
         jQuery('#alerts').append(jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button><h4>Agent saved</h4><p><a href="agents.html">View agents</a></p></div>').alert());
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

