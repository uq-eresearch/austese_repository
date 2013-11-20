<?php 
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'edit')
 */
$apiType = substr(arg(1),0,-1); // remove the trailing 's'
$apiOperation = "load";
$modulePrefix = "repository";
$modulePath = drupal_get_path('module', 'repository');
if ($apiType == "artefact"){
    $filterField = "source";
} else if ($apiType == "place" || $apiType == "agent" || $apiType == "collection" || $apiType == "mvd") {
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
 <?php if (austese_access('edit metadata', $project)): ?>
  data-editable="true"
 <?php endif; ?>
 <?php if ($project):?>
 data-project="<?php print $project; ?>"
 <?php endif; ?>
 data-template="<?= $displaytemplate ?>"
 data-modulepath="<?php print $modulePath; ?>"
 data-moduleprefix="<?php print $modulePrefix; ?>"
 data-apioperation="<?php print $apiOperation;?>"
 data-apitype="<?php print $apiType;?>">
</div>
<div class="row-fluid">
    <div class="span8" id="newobject">
     <?php if (austese_access('edit metadata', $project) && $apiType != 'mvd' && $apiType != 'place'): ?>
       <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/edit<?php if ($project) print '?project='.$project; ?>"><button type="button" class="btn"><i class="fa fa-plus"></i> New <?php print $apiType; ?></button></a>
     <?php endif; ?>
     <?php if ($apiType=='event'):?>
       &nbsp;<a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/map/<?php if ($project): print "?project=".$project; endif; ?>"><button type="button" class="btn"><i class="fa fa-globe"></i> View Map</button></a>
       &nbsp;<a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/timeline/<?php if ($project): print "?project=".$project; endif; ?>"><button type="button" class="btn"><i class="fa fa-clock-o"></i> View Timeline</button></a>
       <?php if ($displaytemplate == 'ChronologyDetail'): ?>
       &nbsp;<a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/<?php if ($project): print "?project=".$project; endif; ?>"><button type="button" class="btn"><i class="fa fa-list"></i> View Details</button></a>
       <?php else: ?>
       &nbsp;<a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/chronology/<?php if ($project): print "?project=".$project; endif; ?>"><button type="button" class="btn"><i class="fa fa-clock-o"></i> View Chronology</button></a>
       <?php endif; ?>
     <?php endif;?>
     </div>
    
    <div class="span2">Sort by: <select  name="sort" id="sort">
       <option value="_id">created</option>
       <option value="label"><?php print $filterField; ?></option>
       <?php if ($apiType == 'event'):?>
        <option <?php if ($displaytemplate == 'ChronologyDetail'):?>
         selected="true" 
         <?php endif; ?> 
         value="metadata.startDate">start date</option>
       <?php endif;?>
        <?php if ($apiType == 'artefact' || $apiType == 'version'):?>
        <option value="metadata.date">date</option>
       <?php endif;?>
    </select>
    </div>
    <input title="Type filter terms and then hit enter" type="text" placeholder="Filter on <?php print $filterField; ?>" class="span2" id="filter"/>

</div>
<div id="resultsummary"></div>
<div id="resultcurrent"></div>
<div id="result"></div>
<div class="btn-toolbar">
    <div class="btn-group" id="pager"></div>
</div>

