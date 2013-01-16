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
      <label class="control-label" for="versionTitle">Title</label>
      <div class="controls">
        <textarea rows="1" name="versionTitle" type="text" class="input-xlarge" id="versionTitle"></textarea>
        <p class="help-block">Title of this version</p>
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
      <label class="control-label" for="description">Description</label>
      <div class="controls">
        <textarea rows="2" name="description" type="text" class="input-xlarge" id="description"></textarea>
        <p class="help-block">Description of this version</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="firstLine">First Line</label>
      <div class="controls">
        <textarea rows="1" name="firstLine" type="text" class="input-xlarge" id="firstLine"></textarea>
        <p class="help-block">First line of this version (e.g. for poetry)</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="publisher">Publisher</label>
      <div class="controls">
        <textarea rows="1" name="publisher" type="text" class="input-xlarge" id="publisher"></textarea>
        <p class="help-block">Publisher of this version</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="name">Name</label>
      <div class="controls">
        <textarea rows="1" name="name" type="text" class="input-xlarge" id="name"></textarea>
        <p class="help-block">Short name of this version</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="illust">Illustrations</label>
      <div class="controls">
        <textarea rows="2" name="illust" type="text" class="input-xlarge" id="illust"></textarea>
        <p class="help-block">Describe illustrations associated with this version</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="artefacts">Artefacts</label>
      <div class="controls">
        <textarea rows="2" name="artefacts" type="text" class="input-xlarge" id="artefacts"></textarea>
        <p class="help-block">Artefacts associated with this version</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="places">Places</label>
      <div class="controls">
        <textarea rows="2" name="places" type="text" class="input-xlarge" id="places"></textarea>
        <p class="help-block">Places associated with this version e.g. place of publication</p>
      </div>
    </div>
    

<div class="control-group">
<div class="controls">
    <input id="save-btn" type="button" class="btn" value="Save">
    <a href="/<?php print $modulePrefix; ?>/versions/<?php if ($existingId): print $existingId; endif; ?>">
    <input type="button" class="btn" value="Cancel"></a>
    <input id="del-btn" style="display:none" type="button" class="btn btn-danger" value="Delete">
</div></div>
  </fieldset>
</form>

