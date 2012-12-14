<?php 
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'add' or 'edit')
 */
$modulePrefix = arg(0);
$apiType = substr(arg(1),0,-1); // remove the trailing 's'
$apiOperation = arg(2);
$existingId=arg(3);
?>
<div id="alerts"></div>
<div id="metadata"
 <?php if (user_access('edit metadata')): ?>
  data-editable="true"
 <?php endif; ?>
 <?php if ($existingId):?>
   data-existingid="<?php print $existingId; ?>"
 <?php endif; ?>
 data-moduleprefix="<?php print $modulePrefix; ?>"
 data-modulepath="<?php print drupal_get_path('module', 'repository'); ?>"
 data-apioperation="<?php print $apiOperation;?>"
 data-apitype="<?php print $apiType;?>">
</div>
<form id="create-object" class="form-horizontal">
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
      <label class="control-label" for="biography">Biography</label>
      <div class="controls">
        <textarea rows="10" class="input-xlarge" name="biography" id="biography"></textarea>
      </div>
    </div>
    <div class="control-group">
      <div class="controls">
         <input id="save-btn" type="button" class="btn" value="Save">
         <input id="del-btn" style="display:none" type="button" class="btn btn-danger" value="Delete">
      </div>
    </div>
  </fieldset>
</form>
