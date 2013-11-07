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
       <a href="/<?php print $modulePrefix; ?>/events/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
       <input type="button" class="btn" value="Cancel"></a>
       <input style="display:none" type="button" class="dupe-btn btn" value="Duplicate">
     </div>
  </div>
  <div class="invisi-well">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="name">Name</label>
      <div class="controls">
        <input autofocus="true" name="name" type="text" class="input-xxlarge" id="name">
        <div id="existingOutput"></div>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="description">Description</label>
      <div class="controls">
        <input name="description" type="text" class="input-xxlarge" id="description">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="references">References</label>
      <div class="controls">
        <input name="references" type="text" class="input-xxlarge" id="references">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="eventType">Type</label>
      <div class="controls">
        <input name="eventType" type="text" class="input-xxlarge" id="eventType">
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
        <input name="startDate" type="text" class="input-xxlarge" id="startDate">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="endDate">Ended</label>
      <div class="controls">
        <input name="endDate" type="text" class="input-xxlarge" id="endDate">
      </div>
    </div>
    <hr class="muted"/>
    <div class="control-group">
      <label class="control-label" for="artefacts">Artefacts</label>
      <div class="controls">
        <textarea rows="2" name="artefacts" type="text" class="input-xxlarge" id="artefacts"></textarea>
        <p class="help-block">Artefacts produced by or impacted on by this event</p>
        <a target="_blank" href="/repository/artefacts/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new artefact in new tab" class="btn"><i class="fa fa-plus"></i> Create new artefact</button>
        </a>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="places">Places</label>
      <div class="controls">
        <textarea rows="2" name="places" type="text" class="input-xxlarge" id="places"></textarea>
        <span class="help-block">Where this event took place</span>
      </div>
    </div>
    <hr class="muted"/>
    <div class="control-group">
    <div class="controls">
    <h4>Agent Roles</h4>
    
    <a target="_blank" href="/repository/agents/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new agent in new tab" class="btn"><i class="fa fa-plus"></i> Create new agent</button>
    </a>
    </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="agents">Agents</label>
      <div class="controls">
        <textarea rows="2" name="agents" type="text" class="input-xxlarge" id="agents"></textarea>
        <p class="help-block">Agents participating in or responsible for this event (no assigned role)</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="authors">Authors</label>
      <div class="controls">
        <textarea rows="2" name="authors" type="text" class="input-xxlarge" id="authors"></textarea>
        <p class="help-block">Agents participating in this event as authors</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="amanuenses">Amanuenses</label>
      <div class="controls">
        <textarea rows="2" name="amanuenses" type="text" class="input-xxlarge" id="amanuenses"></textarea>
        <p class="help-block">Agents participating in this event as people employed to take dictation or create copy in manuscript or typescript</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="influencers">Influencers</label>
      <div class="controls">
        <textarea rows="2" name="influencers" type="text" class="input-xxlarge" id="influencers"></textarea>
        <p class="help-block">Agents participating in this event as influencers</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="editors">Editors</label>
      <div class="controls">
        <textarea rows="2" name="editors" type="text" class="input-xxlarge" id="editors"></textarea>
        <p class="help-block">Agents participating in this event as editors</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="publishers">Publishers</label>
      <div class="controls">
        <textarea rows="2" name="publishers" type="text" class="input-xxlarge" id="publishers"></textarea>
        <p class="help-block">Agents participating in this event as publishers</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="printers">Printers</label>
      <div class="controls">
        <textarea rows="2" name="printers" type="text" class="input-xxlarge" id="printers"></textarea>
        <p class="help-block">Agents participating in this event as printers</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="compositors">Compositors</label>
      <div class="controls">
        <textarea rows="2" name="compositors" type="text" class="input-xxlarge" id="compositors"></textarea>
        <p class="help-block">Agents participating in this event as compositors</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="illustrators">Illustrators</label>
      <div class="controls">
        <textarea rows="2" name="illustrators" type="text" class="input-xxlarge" id="illustrators"></textarea>
        <p class="help-block">Agents participating in this event as illustrators</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="binders">Binders</label>
      <div class="controls">
        <textarea rows="2" name="binders" type="text" class="input-xxlarge" id="binders"></textarea>
        <p class="help-block">Agents participating in this event as binders</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="readers">Readers</label>
      <div class="controls">
        <textarea rows="2" name="readers" type="text" class="input-xxlarge" id="readers"></textarea>
        <p class="help-block">Agents participating in this event as readers</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="translators">Translators</label>
      <div class="controls">
        <textarea rows="2" name="translators" type="text" class="input-xxlarge" id="translators"></textarea>
        <p class="help-block">Agents participating in this event as translators</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="booksellers">Booksellers</label>
      <div class="controls">
        <textarea rows="2" name="booksellers" type="text" class="input-xxlarge" id="booksellers"></textarea>
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
        <textarea rows="2" name="events" type="text" class="input-xxlarge" id="events"></textarea>
        <p class="help-block">Sub-events associated with this event</p>
        <a target="_blank" href="/repository/events/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new event in new tab" class="btn"><i class="fa fa-plus"></i> Create new event</button>
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
      <label class="control-label" for="eventtags">Tags</label>
      <div class="controls">
        <textarea  class="input-xxlarge" name="eventtags" id="eventtags"></textarea>
        <p>Freeform text tags can be used to filter events e.g. when displaying on timelines</p>
      </div>
    </div>
    <div class="control-group">
      <div class="controls">
         <input type="button" class="btn btn-primary save-btn" value="Save">
         <a href="/<?php print $modulePrefix; ?>/events/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
         <input type="button" class="btn" value="Cancel"></a>
         <input style="display:none" type="button" class="btn dupe-btn" value="Duplicate">
         <input style="display:none" type="button" class="btn btn-danger del-btn" value="Delete">
      </div>
    </div>
  </fieldset>
  </div>
</form>
