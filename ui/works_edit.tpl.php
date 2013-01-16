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
      <label class="control-label" for="workTitle">Title</label>
      <div class="controls">
        <textarea rows="1" name="workTitle" type="text" class="input-xlarge" id="workTitle"></textarea>
        <p class="help-block">Full title of the work</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="name">Name</label>
      <div class="controls">
        <textarea rows="1" name="name" type="text" class="input-xlarge" id="name"></textarea>
        <p class="help-block">Short name for the work</p>
      </div>
    </div>
  <div class="control-group">
      <label class="control-label" for="versions">Versions</label>
      <div class="controls">
        <textarea rows="2" name="versions" type="text" class="input-xlarge" id="versions"></textarea>
        <p class="help-block">Versions of this work</p>
      </div>
    </div>
    <div class="control-group">
<div class="controls">
    <input id="save-btn" type="button" class="btn" value="Save">
    <a href="/<?php print $modulePrefix; ?>/works/<?php if ($existingId): print $existingId; endif; ?>">
    <input type="button" class="btn" value="Cancel"></a>
    <input id="del-btn" style="display:none" type="button" class="btn btn-danger" value="Delete">
</div></div>
  </fieldset>
</form>

