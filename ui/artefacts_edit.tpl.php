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
 <?php if (user_access('edit metadata')): ?>
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
      <label class="control-label" for="source">Source</label>
      <div class="controls">
        <textarea rows="1" name="source" type="text" class="input-xlarge" id="source"></textarea>
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
        <textarea rows="1" name="bibDetails" type="text" class="input-xlarge" id="bibDetails"></textarea>
        <p class="help-block">Additional bibliographic details e.g. '26 Apr., p. 5e'</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="publisher">Publisher</label>
      <div class="controls">
        <textarea rows="1" name="publisher" type="text" class="input-xlarge" id="publisher"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="printer">Printer</label>
      <div class="controls">
        <textarea rows="1" name="printer" type="text" class="input-xlarge" id="printer"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="format">Format</label>
      <div class="controls">
        <textarea rows="1" name="format" type="text" class="input-xlarge" id="format"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="paperType">Paper Type</label>
      <div class="controls">
        <textarea rows="1" name="paperType" type="text" class="input-xlarge" id="paperType"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="artefactSize">Size</label>
      <div class="controls">
        <textarea rows="1" name="artefactSize" type="text" class="input-xlarge" id="artefactSize"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="artefacts">Has Part(s)</label>
      <div class="controls">
        <textarea rows="2" name="artefacts" type="text" class="input-xlarge" id="artefacts"></textarea>
        <p class="help-block">ArtefactParts associated with this artefact</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="facsimiles">Facsimiles</label>
      <div class="controls">
        <textarea rows="2" name="facsimiles" type="text" class="input-xlarge" id="facsimiles"></textarea>
        <p class="help-block">Facsimiles associated with this version</p>
      </div>
    </div>
    </fieldset>
    </div>
    <div class="well">
    <fieldset>
    <div class="control-group">
      <label class="control-label" for="project">Project</label>
      <div class="controls">
        <input type="text" class="input-xlarge" name="project" id="project" value="<?php
        if (isset($_GET['project'])) {
         print $_GET['project'];
        } 
        ?>"/>
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
       <input id="save-btn" type="button" class="btn" value="Save">
       <a href="/<?php print $modulePrefix; ?>/artefacts/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
       <input type="button" class="btn" value="Cancel"></a>
       <input id="del-btn" style="display:none" type="button" class="btn btn-danger" value="Delete">
     </div>
  </div>
  </fieldset>
  </div>
</form>

