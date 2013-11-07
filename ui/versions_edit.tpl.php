<?php 
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'add' or 'edit')
 */
$modulePrefix = arg(0);
$apiType = substr(arg(1),0,-1); // remove the trailing 's'
$apiOperation = arg(2);
$existingId = arg(3);
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
       <a href="/<?php print $modulePrefix; ?>/versions/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
       <input type="button" class="btn" value="Cancel"></a>
       <input style="display:none" type="button" class="dupe-btn btn" value="Duplicate">
     </div>
  </div>
  <div class="invisi-well">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="versionTitle">Title</label>
      <div class="controls">
        <textarea autofocus="true" rows="1" name="versionTitle" type="text" class="input-xxlarge" id="versionTitle"></textarea>
        <p class="help-block">Title of this version</p>
        <div id="existingOutput"></div>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="name">Name</label>
      <div class="controls">
        <textarea rows="1" name="name" type="text" class="input-xxlarge" id="name"></textarea>
        <p class="help-block">Short name of this version</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="date">Date</label>
      <div class="controls">
        <input name="date" type="text" class="input-xxlarge" id="date">
        <p class="help-block">e.g. 1875</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="description">Description</label>
      <div class="controls">
        <textarea rows="2" name="description" type="text" class="input-xxlarge" id="description"></textarea>
        <p class="help-block">Description of this version</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="firstLine">First Line</label>
      <div class="controls">
        <textarea rows="1" name="firstLine" type="text" class="input-xxlarge" id="firstLine"></textarea>
        <p class="help-block">First line of this version (e.g. for poetry)</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="publisher">Publisher</label>
      <div class="controls">
        <textarea rows="1" name="publisher" type="text" class="input-xxlarge" id="publisher"></textarea>
        <p class="help-block">Publisher of this version</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="lines">Lines</label>
      <div class="controls">
        <textarea rows="1" name="lines" type="text" class="input-xxlarge" id="lines"></textarea>
        <p class="help-block">Number of lines in this version (e.g. for poetry)</p>
      </div>
    </div>

    <div class="control-group">
      <label class="control-label" for="illust">Illustrations</label>
      <div class="controls">
        <textarea rows="2" name="illust" type="text" class="input-xxlarge" id="illust"></textarea>
        <p class="help-block">Describe illustrations for this version</p>
      </div>
    </div>
    </fieldset>
    </div>
    <div class="well white-well">
    <fieldset>
    <div class="control-group">
      <label class="control-label" for="versions">Has Part(s)</label>
      <div class="controls">
        <textarea rows="2" name="versions" type="text" class="input-xxlarge" id="versions"></textarea>
        <p class="help-block">VersionParts that are part of this version</p>
        <a target="_blank" href="/repository/versions/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new version part in new tab" class="btn"><i class="fa fa-plus"></i> Create new version part</button>
        </a>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="artefacts">Artefacts</label>
      <div class="controls">
        <!--  textarea rows="2" name="artefacts" type="text" class="input-xxlarge" id="artefacts"></textarea-->
        <input type="hidden" class="input-xxlarge" id="artefacts" name="artefacts"/>
        <p class="help-block">Artefacts associated with this version</p>
        <a target="_blank" href="/repository/artefacts/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new artefact in new tab" class="btn"><i class="fa fa-plus"></i> Create new artefact</button>
        </a>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="transcriptions">Transcriptions</label>
      <div class="controls">
        <textarea rows="2" name="transcriptions" type="text" class="input-xxlarge" id="transcriptions"></textarea>
        <p class="help-block">Version transcriptions associated with this version</p>
        <a target="_blank" href="/repository/resources<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Upload new transcription resource in new tab" class="btn"><i class="fa fa-plus"></i> Create new transcription</button>
        </a>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="places">Places</label>
      <div class="controls">
        <textarea rows="2" name="places" type="text" class="input-xxlarge" id="places"></textarea>
        <p class="help-block">Places associated with this version e.g. place of publication</p>
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
    <a href="/<?php print $modulePrefix; ?>/versions/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
    <input type="button" class="btn" value="Cancel"></a>
    <input style="display:none" type="button" class="btn dupe-btn" value="Duplicate">
    <input style="display:none" type="button" class="btn btn-danger del-btn" value="Delete">
</div></div>
  </fieldset>
  </div>
</form>

