<?php 
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'edit')
 */
$apiType = substr(arg(1),0,-1); // remove the trailing 's'
$apiOperation = "load";
$modulePrefix = drupal_get_path('module', 'repository');
if ($apiType == "artefact"){
    $filterField = "source";
} else if ($apiType == "place" || $apiType == "agent" || $apiType == "collection") {
    $filterField = "name";
} else if ($apiType == "event" || $apiType == "action") {
    $filterField = "description";
} else {
    $filterField = "title";
}
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
 data-modulepath="<?php print $modulePrefix; ?>"
 data-moduleprefix="<?php print arg(0); ?>"
 data-apioperation="<?php print $apiOperation;?>"
 data-apitype="<?php print $apiType;?>">
</div>
<div class="row">
    <div class="span10" id="newobject">
     <?php if (user_access('edit metadata') && $apiType != 'mvd'): ?>
       <a href="<?php print $apiType; ?>s/edit<?php if ($project) print '?project='.$project; ?>">+ New <?php print $apiType; ?></a>
     <?php endif; ?>
     <?php if ($apiType=='event'):?>
       &nbsp;&nbsp;&nbsp;<a href="/<?php print arg(0); ?>/<?php print $apiType; ?>s/map/<?php if ($project): print "?project=".$project; endif; ?>">View Map</a><br/>
     <?php endif;?>
     </div>
    <?php if ($apiType != "mvd"):?>
    <input title="Type filter terms and then hit enter" type="text" placeholder="Filter on <?php print $filterField; ?>" class="span2" id="filter"/>
    <?php endif; ?>
</div>
<div id="resultsummary"></div>
<div id="resultcurrent"></div>
<div id="result"></div>
<div class="btn-toolbar">
    <div class="btn-group" id="pager"></div>
</div>

