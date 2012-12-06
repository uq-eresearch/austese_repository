<?php 
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'edit')
 */
$apiType = substr(arg(1),0,-1); // remove the trailing 's'
$apiOperation = "load";
if ($apiType == "artefact"){
    $filterField = "source";
} else if ($apiType == "place") {
    $filterField = "name";
}else {
    $filterField = "title";
}
?>
<div id="alerts"></div>
<div id="metadata"
 <?php if (user_access('edit metadata')): ?>
  data-editable="true"
 <?php endif; ?>
 data-modulepath="<?php print drupal_get_path('module', 'repository'); ?>"
 data-moduleprefix="<?php print arg(0); ?>"
 data-apioperation="<?php print $apiOperation;?>"
 data-apitype="<?php print $apiType;?>">
</div>
<div class="row">
    <div class="span10" id="newobject">
     <?php if (user_access('edit metadata')): ?>
       <a href="<?php print $apiType; ?>s/edit">+ New <?php print $apiType; ?></a>
     <?php endif; ?>
    </div>
    <input title="Type filter terms and then hit enter" type="text" placeholder="Filter on <?php print $filterField; ?>" class="span2" id="filter">
</div>
<div id="resultsummary"></div>
<div id="resultcurrent"></div>
<div id="result"></div>
<div class="btn-toolbar">
    <div class="btn-group" id="pager"></div>
</div>

