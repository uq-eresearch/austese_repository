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
  <div class="sticky-bottom well">
    <div class="pull-right">
       <input type="button" class="save-btn btn btn-primary" value="Save">
       <a href="/<?php print $modulePrefix; ?>/works/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
       <input type="button" class="btn" value="Cancel"></a>
       <input style="display:none" type="button" class="dupe-btn btn" value="Duplicate">
     </div>
  </div>
  <div class="invisi-well">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="workTitle">Title</label>
      <div class="controls">
        <textarea autofocus="true" rows="1" name="workTitle" type="text" class="input-xxlarge" id="workTitle"></textarea>
        <p class="help-block">Full title of the work</p>
        <div id="existingOutput"></div>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="name">Name</label>
      <div class="controls">
        <textarea rows="1" name="name" type="text" class="input-xxlarge" id="name"></textarea>
        <p class="help-block">Short name for the work</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="description">Description</label>
      <div class="controls">
        <textarea rows="2" name="description" type="text" class="input-xxlarge" id="description"></textarea>
        <p class="help-block">Description of this work</p>
      </div>
    </div>
    </fieldset>
  </div>
  <div class="well white-well">
  <fieldset>
   <div class="control-group">
      <label class="control-label" for="authors">Author(s)</label>
      <div class="controls">
        <textarea rows="1" name="authors" type="text" class="input-xxlarge" id="authors"></textarea>
        <p class="help-block">Author(s) of this work</p>
        <a target="_blank" href="/repository/agents/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new agent in new tab" class="btn"><i class="fa fa-plus"></i> Create new agent</button>
        </a>
      </div>
    </div>
  <div class="control-group">
      <label class="control-label" for="versions">Versions</label>
      <div class="controls">
        <textarea rows="2" name="versions" type="text" class="input-xxlarge" id="versions"></textarea>
        <p class="help-block">Versions of this work</p>
        <a target="_blank" href="/repository/versions/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new version in new tab" class="btn"><i class="fa fa-plus"></i> Create new version</button>
        </a>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="readingVersion">Reading Version</label>
      <div class="controls">
        <textarea rows="2" name="readingVersion" type="text" class="input-xxlarge" id="readingVersion"></textarea>
        <p class="help-block">The default reading version</p>
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
          <input name="locked" id="locked" type="checkbox">Locked
          </label>
        </div>
    </div>
    <div class="control-group">
<div class="controls">
    <input type="button" class="btn btn-primary save-btn" value="Save">
    <a href="/<?php print $modulePrefix; ?>/works/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
    <input type="button" class="btn" value="Cancel"></a>
    <input style="display:none" type="button" class="btn dupe-btn" value="Duplicate">
    <input style="display:none" type="button" class="btn btn-danger del-btn" value="Delete">
</div></div>
  </fieldset>
  </div>
</form>

