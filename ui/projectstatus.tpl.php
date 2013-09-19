<?php 
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'add' or 'edit')
 */
$modulePrefix = arg(0);
$apiType = substr(arg(1),0,-1); // remove the trailing 's'
$existingId = arg(2);
$project = null;
if (isset($_GET['project'])) {
 $project = $_GET['project'];
}
$modulePath =  drupal_get_path('module', 'repository');
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
 data-modulepath="<?php print $modulePath; ?>"
 data-servername="<?php print $_SERVER['SERVER_NAME']; ?>"
 data-apitype="<?php print $apiType;?>">
</div>

    

<div class="container-fluid fill">
<div class="row-fluid">
<div id="result" class="span8">
    <h1>Project Status</h1>

    <?php 
    foreach ($counts as $recordtype => $count) {
        print "$recordtype: $count<br>";
    }
    ?>
    
</div>
<div class="actionsidebar span4 filler">


</div>
</div>
</div>
