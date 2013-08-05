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
      <label class="control-label" for="description">Description</label>
      <div class="controls">
        <input name="description" type="text" class="input-xlarge" id="description">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="eventType">Type</label>
      <div class="controls">
        <input name="eventType" type="text" class="input-xlarge" id="eventType">
        <p class="help-block">E.g. composition, serialisation, edition, writing, editing, advising, printing, publishing...</p>
      </div>
    </div>
    </fieldset>
    </div>
    
    
    
    <div class="well white-well">
    <p>These fields are most likely to apply to basic "action" events:</p>
    <fieldset>
    
    <div class="control-group">
      <label class="control-label" for="startDate">Began</label>
      <div class="controls">
        <input name="startDate" type="text" class="input-xlarge" id="startDate">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="endDate">Ended</label>
      <div class="controls">
        <input name="endDate" type="text" class="input-xlarge" id="endDate">
      </div>
    </div>
    <hr class="muted"/>
    <div class="control-group">
      <label class="control-label" for="artefacts">Artefacts</label>
      <div class="controls">
        <textarea rows="2" name="artefacts" type="text" class="input-xlarge" id="artefacts"></textarea>
        <p class="help-block">Artefacts produced by or impacted on by this event</p>
        <a target="_blank" href="/repository/artefacts/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new artefact in new tab" class="btn"><i class="icon-plus"></i> New artefact</button>
        </a>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="places">Places</label>
      <div class="controls">
        <textarea rows="2" name="places" type="text" class="input-xlarge" id="places"></textarea>
        <span class="help-block">Where this event took place</span>
      </div>
    </div>
    <hr class="muted"/>
    <div class="control-group">
    <div class="controls">
    <h4>Agent Roles</h4>
    
    <a target="_blank" href="/repository/agents/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new agent in new tab" class="btn"><i class="icon-plus"></i> New agent</button>
    </a>
    </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="agents">Agents</label>
      <div class="controls">
        <textarea rows="2" name="agents" type="text" class="input-xlarge" id="agents"></textarea>
        <p class="help-block">Agents participating in or responsible for this event (no assigned role)</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="authors">Authors</label>
      <div class="controls">
        <textarea rows="2" name="authors" type="text" class="input-xlarge" id="authors"></textarea>
        <p class="help-block">Agents participating in this event as authors</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="writers">Writers</label>
      <div class="controls">
        <textarea rows="2" name="writers" type="text" class="input-xlarge" id="writers"></textarea>
        <p class="help-block">Agents participating in this event as writers (as distinct from authors)</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="advisers">Advisers</label>
      <div class="controls">
        <textarea rows="2" name="advisers" type="text" class="input-xlarge" id="advisers"></textarea>
        <p class="help-block">Agents participating in this event as advisers</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="editors">Editors</label>
      <div class="controls">
        <textarea rows="2" name="editors" type="text" class="input-xlarge" id="editors"></textarea>
        <p class="help-block">Agents participating in this event as editors</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="publishers">Publishers</label>
      <div class="controls">
        <textarea rows="2" name="publishers" type="text" class="input-xlarge" id="publishers"></textarea>
        <p class="help-block">Agents participating in this event as publishers</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="printers">Printers</label>
      <div class="controls">
        <textarea rows="2" name="printers" type="text" class="input-xlarge" id="printers"></textarea>
        <p class="help-block">Agents participating in this event as printers</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="compositors">Compositors</label>
      <div class="controls">
        <textarea rows="2" name="compositors" type="text" class="input-xlarge" id="compositors"></textarea>
        <p class="help-block">Agents participating in this event as compositors</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="amanuenses">Amanuenses</label>
      <div class="controls">
        <textarea rows="2" name="amanuenses" type="text" class="input-xlarge" id="amanuenses"></textarea>
        <p class="help-block">Agents participating in this event as people employed to take dictation or create copy in manuscript or typescript</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="illustrators">Illustrators</label>
      <div class="controls">
        <textarea rows="2" name="illustrators" type="text" class="input-xlarge" id="illustrators"></textarea>
        <p class="help-block">Agents participating in this event as illustrators</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="binders">Binders</label>
      <div class="controls">
        <textarea rows="2" name="binders" type="text" class="input-xlarge" id="binders"></textarea>
        <p class="help-block">Agents participating in this event as binders</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="readers">Readers</label>
      <div class="controls">
        <textarea rows="2" name="readers" type="text" class="input-xlarge" id="readers"></textarea>
        <p class="help-block">Agents participating in this event as readers</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="translators">Translators</label>
      <div class="controls">
        <textarea rows="2" name="translators" type="text" class="input-xlarge" id="translators"></textarea>
        <p class="help-block">Agents participating in this event as translators</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="booksellers">Booksellers</label>
      <div class="controls">
        <textarea rows="2" name="booksellers" type="text" class="input-xlarge" id="booksellers"></textarea>
        <p class="help-block">Agents participating in this event as booksellers</p>
      </div>
    </div>
    
    </fieldset>
    </div>
    <div class="well white-well">
    <p>This field is most likely to apply to "composite" events:</p>
    <fieldset>
    <div class="control-group">
      <label class="control-label" for="events">Sub-Events</label>
      <div class="controls">
        <textarea rows="2" name="events" type="text" class="input-xlarge" id="events"></textarea>
        <p class="help-block">Sub-events associated with this event</p>
        <a target="_blank" href="/repository/events/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new event in new tab" class="btn"><i class="icon-plus"></i> New event</button>
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
         <a href="/<?php print $modulePrefix; ?>/events/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
         <input type="button" class="btn" value="Cancel"></a>
         <input id="dupe-btn" style="display:none" type="button" class="btn" value="Duplicate">
         <input id="del-btn" style="display:none" type="button" class="btn btn-danger" value="Delete">
      </div>
    </div>
  </fieldset>
  </div>
</form>
