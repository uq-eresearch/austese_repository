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
      <label class="control-label" for="source">Source</label>
      <div class="controls">
        <input name="source" type="text" class="input-xlarge" id="source">
        <p class="help-block">Short title to identify artefact/source e.g. MS378</p>
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
      <label class="control-label" for="bibDetails">Bibliographic Details</label>
      <div class="controls">
        <input name="bibDetails" type="text" class="input-xlarge" id="bibDetails">
        <p class="help-block">Additional bibliographic details e.g. '26 Apr., p. 5e'</p>
      </div>
    </div
  <div class="control-group">
     <div class="controls">
       <input id="save-btn" type="button" class="btn" value="Save">
       <input id="del-btn" style="display:none" type="button" class="btn btn-danger" value="Delete">
     </div>
  </div>
  </fieldset>
</form>

