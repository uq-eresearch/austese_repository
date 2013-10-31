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
$project = null;
if (isset($_GET['project'])) {
 $project = $_GET['project'];
}
?>
<div id="alerts"></div>
<div id="metadata"
 <?php if (austese_access('edit metadata', $project)): ?>
  data-editable="true"
 <?php endif; ?>
 <?php if ($project):?>
 data-project="<?php print $project; ?>"
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
  <p>Please confirm that you wish to delete the following MVD (this action cannot be undone):</p>
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="name">Name</label>
      <div class="controls">
        <input readonly name="name" type="text" class="input-xxlarge" id="name">
      </div>
    </div>
    <div class="control-group">
      <div class="controls">
         <a href="/<?php print $modulePrefix; ?>/mvds/<?php if ($project): print "?project=".$project; endif; ?>">
         <input type="button" class="btn" value="Cancel"></a>
         <input style="display:none" type="button" class="btn btn-danger del-btn" value="Delete">
      </div>
    </div>
  </fieldset>
</form>
