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
       <a href="/<?php print $modulePrefix; ?>/artefacts/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
       <input type="button" class="btn" value="Cancel"></a>
       <input style="display:none" type="button" class="dupe-btn btn" value="Duplicate">
     </div>
  </div>
  <div class="invisi-well">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="source">Title</label>
      <div class="controls">
        <textarea autofocus="true" rows="1" name="source" type="text" class="input-xxlarge" id="source"></textarea>
        <p class="help-block">Short title to identify artefact source (or artefact part) e.g. MS378</p>
        <div id="existingOutput"></div>
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
        <textarea rows="1" name="description" type="text" class="input-xxlarge" id="description"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="bibDetails">Bibliographic Details</label>
      <div class="controls">
        <textarea rows="1" name="bibDetails" type="text" class="input-xxlarge" id="bibDetails"></textarea>
        <p class="help-block">Additional bibliographic details</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="pageNumbers">Page Numbers(s)</label>
      <div class="controls">
        <textarea rows="1" name="pageNumbers" type="text" class="input-xxlarge" id="pageNumbers"></textarea>
        <p class="help-block">Page numbers e.g. 4, 8</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="series">Series</label>
      <div class="controls">
        <textarea rows="1" name="series" type="text" class="input-xxlarge" id="series"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="format">Format</label>
      <div class="controls">
        <textarea rows="1" name="format" type="text" class="input-xxlarge" id="format"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="paperType">Paper Type</label>
      <div class="controls">
        <textarea rows="1" name="paperType" type="text" class="input-xxlarge" id="paperType"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="artefactSize">Size</label>
      <div class="controls">
        <textarea rows="1" name="artefactSize" type="text" class="input-xxlarge" id="artefactSize"></textarea>
      </div>
    </div>
    </fieldset>
    </div>
  <div class="well white-well">
  
  <fieldset>
    <div class="control-group">
    
      <label class="control-label" for="artefacts">Has Part(s)</label>
      <div class="controls ">
        
        <input name="artefacts" type="text" id="artefacts" class="input-xxlarge" />
        <p class="help-block">ArtefactParts associated with this artefact</p>
        <a target="_blank" href="/repository/artefacts/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new artefact part in new tab" class="btn"><i class="fa fa-plus"></i> Create new artefact part</button>
        </a>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="facsimiles">Facsimiles</label>
      <div class="controls">
        <textarea rows="2" name="facsimiles" type="text" class="input-xxlarge" id="facsimiles"></textarea>
        <p class="help-block">Facsimiles associated with this artefact</p>
        <a target="_blank" href="/repository/resources<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Upload new facsimile resource in new tab" class="btn"><i class="fa fa-plus"></i> Create new facsimile</button>
        </a>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="coverImage">Cover Image</label>
      <div class="controls">
        <textarea rows="2" name="coverImage" type="text" class="input-xxlarge" id="coverImage"></textarea>
        <p class="help-block">Image to display as cover for this artefact (if not specified, first image in facsimiles field will be used by default)</p>
        <a target="_blank" href="/repository/resources<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Upload new image resource in new tab" class="btn"><i class="fa fa-plus"></i> Create new image</button>
        </a>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="transcriptions">Diplomatic Transcriptions</label>
      <div class="controls">
        <textarea rows="2" name="transcriptions" type="text" class="input-xxlarge" id="transcriptions"></textarea>
        <p class="help-block">This field is only used to link DIPLOMATIC Transcriptions to Artefacts. Version Transcriptions should be linked to Versions only</p>
        <a target="_blank" href="/repository/resources<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Upload new transcription resource in new tab" class="btn"><i class="fa fa-plus"></i> Create new transcription</button>
        </a>
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
       <input type="button" class="save-btn btn btn-primary" value="Save">
       <a href="/<?php print $modulePrefix; ?>/artefacts/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
       <input type="button" class="btn" value="Cancel"></a>
       <input style="display:none" type="button" class="dupe-btn btn" value="Duplicate">
       <input style="display:none" type="button" class="del-btn btn btn-danger" value="Delete">
     </div>
  </div>
  </fieldset>
  </div>
</form>

