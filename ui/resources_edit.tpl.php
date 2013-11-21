<?php 
$modulePrefix = arg(0);
$existingId = arg(3);
$project = null;
if (isset($_GET['project'])) {
 $project = $_GET['project'];
}
if (isset($_GET['multi'])) {
 $multi = $_GET['multi'];
} else {
 $multi = false;
}
$projectparam = '';
if (isset($project)) {
    $projectparam = '?project=' . $project;
}

?>
<div id="metadata"
 <?php if (austese_access('edit metadata', $project)): ?>
  data-editable="true"
  data-editurl="<?php print $GLOBALS['base_url'] . '/' . arg(0) . '/resources/edit/' . arg(3);?>"
 <?php endif; ?>
 <?php if ($project):?>
  data-project="<?php print $project; ?>"
 <?php endif; ?>
 <?php if ($existingId):?>
   data-existingid="<?php print $existingId; ?>"
 <?php endif; ?>
 data-multi="<?php print $multi; ?>"
 data-moduleprefix="<?php print $modulePrefix; ?>"
 data-modulepath="<?php print drupal_get_path('module', 'repository'); ?>"
 data-servername="<?php print $_SERVER['SERVER_NAME']; ?>">
</div>
<div id="successMessage" style="display:none" class="alert alert-success">
  <a href="#" data-dismiss="alert"class="close">x</a>
  <span class="label label-success">Success</span> Resource has been updated. Return to <a href="/repository/resources/<?php print arg(3) . $projectparam; ?>">View Resource</a> page.
</div>
<div id="failureMessage" style="display:none" class="alert alert-error">
  <a href="#" data-dismiss="alert" class="close">x</a>
  <span id="failMessage"></span>
</div>
<div class="btn-toolbar">
  <div class="buttons btn-group">
    <a id="toggleFacsimile" class="btn" href="#"><i class="fa fa-picture-o"></i> Show facsimile</a>
    <a id="togglePreview" class="btn" href="#"><i class="fa fa-eye-slash"></i> Hide preview</a>
    <a id="toggleMulti" class="btn" href="#"><i class="fa fa-random"></i> Compare while editing</a>
  </div>
</div>

<div class="form-horizontal">
  <div class="sticky-bottom well">
    <div class="pull-right">
       <button data-resource="/<?php print drupal_get_path('module', 'repository');?>/api/resources/<?php print arg(3); ?>" class="btn btn-primary savebtn" title="Save as new version">Save</button>
       <a href="/<?php print $modulePrefix; ?>/resources/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
       <input type="button" class="btn" value="Cancel"></a>
    </div>
  </div>
</div>


<!--  ui for multi/merge editor -->
<div id="multi-editor-ui">
  <div class="row-fluid">
    <div class="span12">
      <div class="editInfo"></div>
      <div id="multieditor"></div>
    </div>
  </div>
  <div class="row-fluid">
    <div class="span12 form-actions form-center">
       <div class="span6">
        <button data-resource="/<?php print drupal_get_path('module', 'repository');?>/api/resources/<?php print arg(3); ?>" class="btn btn-primary savebtn" title="Save as new version">Save</button>
       </div>
       <div class="span6">
       <input type="hidden" class="span12" id="rhs-select"/>
       </div>
    </div>
  </div>
  <div class="row-fluid">
   <div class="span12 edit-preview">
   </div>
  </div>
</div>

<!--  ui for basic editor -->
<div id="single-editor-ui" class="row-fluid">
  <div id="editorspan" class="span6">

    <div class="editInfo"></div>
    <textarea id="editor" name="editor"> </textarea>
  </div>
  <div id="preview" class="span6">
    <div class="edit-preview">
    </div>
  </div>
</div>


<div id="facsimile">
  <b><a id="prevFacsimile" href="#">Prev</a></b>
  <span class="count">Image <input style="width:20px" type="text" class="pageNum" value="--"/> of <span class="totalPages">--</span></span>
  <b><a id="nextFacsimile" href="#">Next</a></b>
  
  <div class="parent">
    <div class="imageHolder"></div>
  </div>
  <div class="btn-toolbar">
    <div class="buttons btn-group">
      <button class="zoom-in btn"><i class="fa fa-search-plus"></i></button>
      <button class="zoom-out btn"><i class="fa fa-search-minus"></i></button>
      <input type="range" class="zoom-range">
      <button class="reset btn">Reset</button>
    </div>
  </div>
</div>


