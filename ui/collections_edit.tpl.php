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
  <div class="invisi-well">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="name">Name</label>
      <div class="controls">
        <textarea rows="1" name="name" type="text" class="input-xxlarge" id="name"></textarea>
        <p class="help-block">Name used to identify collection</p>
        <div id="existingOutput"></div>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="resources">Resources</label>
      <div class="controls">
        <textarea rows="2" name="resources" type="text" class="input-xxlarge" id="resources"></textarea>
        <p class="help-block">Resources that are part of this ResourceCollection</p>
      </div>
    </div>
    </fieldset>
    </div>
    <div class="well">
    <fieldset>
    <div class="control-group">
      <label class="control-label" for="project">Project</label>
      <div class="controls">
        <input type="text" class="input-xxlarge" name="project" id="project"/>
      </div>
    </div>
    <div class="control-group">
      <div class="controls">
        <label class="checkbox">
        <input name="locked" id="locked" type="checkbox"> Locked
        </label>
      </div>
    </div>
  <div class="control-group">
     <div class="controls">
       <input type="button" class="btn btn-primary save-btn" value="Save">
       <a href="/<?php print $modulePrefix; ?>/collections/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
       <input type="button" class="btn" value="Cancel"></a>
       <input style="display:none" type="button" class="btn btn-danger del-btn" value="Delete">
     </div>
  </div>
  </fieldset>
  </div>
</form>

