<?php 
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'add' or 'edit')
 */
$modulePrefix = arg(0);
$existingId = arg(2);
$project = null;
if (isset($_GET['project'])) {
 $project = $_GET['project'];
}
$cloud = false;
if (isset($_GET['cloud'])) {
 $cloud = true;
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
 data-basepath="<?php print base_path();?>"
 data-moduleprefix="<?php print $modulePrefix; ?>"
 data-modulepath="<?php print drupal_get_path('module', 'repository'); ?>"
 data-servername="<?php print $_SERVER['SERVER_NAME']; ?>">
</div>

<div><p class="resource"></p></div>
<div class="row-fluid">
  <div class="btn-toolbar" id="panzoom-toolbar" style="display:none">
    <div class="buttons btn-group">
      <button class="zoom-in btn"><i class="fa fa-search-plus"></i></button>
      <button class="zoom-out btn"><i class="fa fa-search-minus"></i></button>
      <input type="range" class="zoom-range">
      <button class="reset btn">Reset</button>
    </div>
    <button class="enableAnnotations btn" style="display:none;"><i class="fa fa-comments"></i> Enable Annotations</button>
  </div>
</div>

<div class="btn-toolbar">
  <div class="buttons btn-group" style="display: none;">
    <a id="toggleFacsimile" class="btn" href="#"><i class="fa fa-picture-o"></i> Show facsimile</a>
  </div>
</div>

<div class="row-fluid">
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

<div id="resourceContent" class="span<?php if ($cloud) print "9"; else print "12"; ?> well white-well" data-id="http://<?php print $_SERVER['SERVER_NAME']; ?>/repository/resources/<?php print $existingId; ?>/content">
Rendering content...
</div>
<?php if ($cloud): ?>
<div class="span3">
  <div class="row-fluid">
    <div id="wordcloud"></div>
  </div>
  <div class="row-fluid">
    <div id="concordance"></div>
  </div>
</div>
<?php endif; ?>
</div>
<div id="wordCount"></div>
<div id="selectedWordCount"></div>
