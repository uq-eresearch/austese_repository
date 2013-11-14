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
 data-modulepath="<?php print $modulePath; ?>"
 data-servername="<?php print $_SERVER['SERVER_NAME']; ?>"
 data-apitype="<?php print $apiType;?>">
</div>

    

<div class="container-fluid fill">
<div class="row-fluid">
<div id="result" class="span8"></div>
<?php if ($apiType!='place'):?>
<div class="actionsidebar span4 filler">
<div>
<ul class="actionLinks">
   <?php if (austese_access('edit metadata', $project)): ?>
      <li id="editlink" ><i class="sidebaricon fa fa-pencil-square-o"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/edit/<?php print $existingId; ?><?php if ($project): print "?project=".$project; endif; ?>">EDIT
      <?php if ($apiType=='resource'):?> CONTENT<?php else:?> METADATA<?php endif; ?>
      </a></li>
   <?php endif; ?>
   <?php if ($apiType=='resource'):?>
   <li><i class="sidebaricon fa fa-eye"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/<?php print $existingId; ?>/content<?php if ($project): print '?project='.$project; endif; ?>">VIEW CONTENT</a></li>
   <li><i class="sidebaricon fa fa-download"></i> <a href="/<?php print $modulePath; ?>/api/<?php print $apiType; ?>s/<?php print $existingId; ?>">DOWNLOAD</a></li>
   <?php if (austese_access('edit metadata', $project)): ?>
        <!--  li><i class="sidebaricon fa fa-th"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s<?php if ($project): print '?project='.$project; endif; ?>#<?php print $existingId; ?>">SHOW IN ORGANISER</a></li-->
   <?php endif; ?>
   <li style="display:none" id="wordcloudlink"><i class="sidebaricon fa fa-cloud"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/<?php print $existingId; ?>/content?cloud=true<?php if ($project): print '&project='.$project; endif; ?>">VIEW WORD CLOUD</a></li>
   <li style="display:none" id="lightboxlink"><i class="sidebaricon fa fa-lightbulb-o"></i> <a  href="/lightbox<?php if ($project): print '?project='.$project; endif; ?>#<?php print $existingId; ?>">VIEW IN LIGHTBOX</a></li>
   <li id="pdflink"><i class="sidebaricon fa icomoon-file-pdf"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/<?php print $existingId; ?>/content/pdf">EXPORT PDF</a></li>
   <li id="mswordlink"><i class="sidebaricon fa icomoon-file-word"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/<?php print $existingId; ?>/content/word">EXPORT WORD DOC</a></li>
   <?php endif; ?>
  

   
   <?php if ($apiType=='work'):?><li><i class="sidebaricon fa fa-book"></i> <a href="/reading/<?php print $existingId; ?><?php if ($project): print "?project=".$project; endif; ?>">READ</a></li><?php endif; ?>
 <li><i class="sidebaricon fa fa-asterisk"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/visualize/<?php print $existingId; ?><?php if ($project): print "?project=".$project; endif; ?>">VISUALIZE CONNECTIONS</a></li>
 </ul>
 <?php if ($apiType=='resource'):?>
 <div style="margin-top:1em" id="viewmvd"></div>
 <?php endif; ?>
 <div style="margin-top:1em" id="relatedObjects"></div>
</div>

<!--  h4>History:</h4>
<div id="history">No other revisions available</div-->
</div>
<?php endif; ?>
</div>
</div>
