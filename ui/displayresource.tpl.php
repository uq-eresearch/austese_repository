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
$annotationView = false;
if (isset($_GET['annotationView'])) {
 $annotationView = true;
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
 data-servername="<?php print $_SERVER['SERVER_NAME']; ?>">
</div>

<div><p class="resource"></p></div>
<div class="row-fluid">
<div id="resourceContent" class="span<?php if ($cloud && $annotationView)  print "8"; else if ($cloud) print "9"; else if ($annotationView) print "11"; else print "12";; ?> well white-well" data-id="http://<?php print $_SERVER['SERVER_NAME']; ?>/repository/resources/<?php print $existingId; ?>/content">
Rendering content...
</div>
<?php if ($annotationView): ?>
<div class="span1">
  <div class="row-fluid">
    <div id="annotationView" class="well white-well" style="width:16px;"></div>
  </div>
</div>
<div id="popover_content_wrapper" style="display: none">
  <div>This is your div content</div>
</div>
<?php endif; ?>
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
