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
<div>Editing metadata for <span class="resource" data-template="compact" data-resourceid="<?php print $existingId; ?>"></span></div>
<form id="create-object" class="form-horizontal">
  <div class="sticky-bottom well">
    <div class="pull-right">
       <input type="button" class="save-btn btn btn-primary" value="Save">
       <a href="/<?php print $modulePrefix; ?>/resources/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
       <input type="button" class="btn" value="Cancel"></a>
       <input style="display:none" type="button" class="dupe-btn btn" value="Duplicate">
     </div>
  </div>
<div class="invisi-well">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="title">Title</label>
      <div class="controls">
        <input autofocus="true" name="metadata.title" type="text" class="input-xxlarge" id="title">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="shortname">Short Name</label>
      <div class="controls">
        <input name="metadata.shortname" type="text" class="input-xxlarge" id="shortname">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="coverage">Coverage</label>
      <div class="controls">
        <input name="metadata.coverage" type="text" class="input-xxlarge" id="coverage">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="description">Description</label>
      <div class="controls">
        <textarea rows="10" class="input-xxlarge" name="metadata.description" id="description"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="format">Format</label>
      <div class="controls">
        <input name="metadata.format" type="text" class="input-xxlarge" id="format">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="language">Language</label>
      <div class="controls">
        <input name="metadata.language" type="text" class="input-xxlarge" id="language">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="license">License</label>
      <div class="controls">
        <input name="metadata.license" type="text" class="input-xxlarge" id="license">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="publisher">Publisher</label>
      <div class="controls">
        <input name="metadata.publisher" type="text" class="input-xxlarge" id="publisher">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="rights">Rights</label>
      <div class="controls">
        <input name="metadata.rights" type="text" class="input-xxlarge" id="rights">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="source">Source</label>
      <div class="controls">
        <input name="metadata.source" type="text" class="input-xxlarge" id="source">
      </div>
    </div>
    
    </fieldset>
    </div>
    
    <div class="well">
      <fieldset>
      <div class="control-group">
        <label class="control-label" for="project">Project</label>
        <div class="controls">
          <input type="text" class="input-xxlarge" name="metadata.project" id="project" value="<?php
          if (isset($_GET['project'])) {
           print $_GET['project'];
          } 
          ?>"/>
        </div>
      </div>
      <div class="control-group">
        <div class="controls">
          <label class="checkbox">
          <input name="metadata.locked" id="metadata.locked" type="checkbox"> Locked
          </label>
        </div>
      </div>
      
      <div class="control-group">
        <div class="controls">
        <!--  FIXME: save saves json as content not metadata -->
           <input type="button" class="btn btn-primary save-btn" value="Save">
           <a href="/<?php print $modulePrefix; ?>/resources/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
           <input type="button" class="btn" value="Cancel"></a>
           <!--  input style="display:none" type="button" class="btn dupe-btn" value="Duplicate"-->
           <input style="display:none" type="button" class="btn btn-danger del-btn" value="Delete">
        </div>
      </div>
      </fieldset>
    </div>
</form>
