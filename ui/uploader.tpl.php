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
if (property_exists($user,'data')){
 $fullscreen = $user->data['fullscreen'];
} else {
 $fullscreen = false;
}
$project = null;
if (isset($_GET['project'])) {
 $project = $_GET['project'];
}
?>
<!--  TODO: check permissions to determine whether to enable collation tools -->
<div id="metadata"
 <?php if (user_access('edit metadata')): ?>
  data-editable="true"
 <?php endif; ?>
 <?php if ($existingId):?>
 data-existingid="<?php print $existingId; ?>"
 <?php endif; ?>
 <?php if ($fullscreen):?>
 data-fullscreen="<?php print $fullscreen; ?>"
 <?php endif; ?>
 <?php if ($project):?>
 data-project="<?php print $project; ?>"
 <?php endif; ?>
 data-moduleprefix="<?php print $modulePrefix; ?>"
 data-modulepath="<?php print drupal_get_path('module', 'repository'); ?>"
 data-enablecollation="<?php print module_exists('collationtools');?>"
 data-enablelightbox="<?php print module_exists('lightbox');?>"
 data-enablealignment="<?php print module_exists('alignment');?>"
 data-apitype="<?php print $apiType;?>">
</div>
<link rel="stylesheet" href="/sites/all/libraries/ext-4.1.1a/resources/css/ext-all.css">
<link rel="stylesheet" href="/sites/all/libraries/ext-4.1.1a/resources/css/ext-all-gray.css">
<div id="uploaderui"></div>
<div id="images"></div>


