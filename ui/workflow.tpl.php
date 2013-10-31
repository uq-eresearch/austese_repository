<?php
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'add' or 'edit')
 */
$modulePrefix = arg(0);
$apiType = substr(arg(1), 0, -1); // remove the trailing 's'
$existingId = arg(2);
$project = null;
if (isset($_GET['project'])) {
    $project = $_GET['project'];
}
$modulePath = drupal_get_path('module', 'repository');
?>
<div id="alerts"></div>
<div id="metadata"
 <?php if (austese_access('edit metadata', $project)): ?>
         data-editable="true"
     <?php endif; ?>
     <?php if ($project): ?>
         data-project="<?php print $project; ?>"
     <?php endif; ?>
     <?php if ($existingId): ?>
         data-existingid="<?php print $existingId; ?>"
     <?php endif; ?>
     data-moduleprefix="<?php print $modulePrefix; ?>"
     data-modulepath="<?php print $modulePath; ?>"
     data-servername="<?php print $_SERVER['SERVER_NAME']; ?>"
     data-apitype="<?php print $apiType; ?>">
</div>
<div class="row-fluid">
    <div class="span12 well well-large">
        <h3>Scholarly Editing Workflow</h3>
        <p>This page collects the components integrated into the AustESE Workbench. Each component is designed to satisfy a fundamental need in the scholarly editing workflow. </p>
    </div>
</div>
<div class="row-fluid">
    <div class="well well-large span6">
        <h3>Describe Entities</h3>
        <p>Create metadata to describe original materials and associated entities.</p>
        <p>The AustESE Workbench support full descriptions of the bibliographical material and associated text. The adoption of well-established principles of bibliographical description is extended by enabling relationships between entities to be asserted. The primary entities in the AustESE Workbench are Artefacts, Versions, Works, Agents, Places and Events. By extending fundamental bibliographical description with temporal and spatial contexts, alternative and innovative pathways can be created with network visualisations, timelines and maps.
        <ul>
            <li><a href="/repository/artefacts/edit<?= $projParam ?>">Describe new artefact</a></li>
            <li><a href="/repository/versions/edit<?= $projParam ?>">Describe new version</a></li>
            <li><a href="/repository/works/edit<?= $projParam ?>">Describe new work</a></li>
            <li><a href="/repository/agents/edit<?= $projParam ?>">Describe new agent</a></li>
            <li><a href="/repository/events/edit<?= $projParam ?>">Describe new event</a></li>
        </ul>
    </div>
    <div class="well well-large span6">
        <h3>Upload Digitised Resources</h3>
        <p>Before or after bibliographical description has been commenced, images and transcriptions can be uploaded and described using the <a href="/repository/resources<?= $projParam ?>">Digital Resource Organiser</a>. Descriptions can be added to individual files or batches of files.</p> 
        <p>Edit metadata associated with selected digital resources via the Edit button in the left-hand panel of the organiser. <br/>A simple text editor is included in the Workbench. Edit transcriptions via the Send To menu when a single transcription is selected in the organiser.</p>
    </div>
</div>
<div class="row-fluid">
    <div class="span6 well well-large">
        <h3>Link</h3>
        <p>After bibliographical descriptions are added and digital resources are uploaded, images and transcriptions can be linked to their respective entities, such as an artefact or version. Edit <a href="/repository/artefacts<?= $projParam ?>">artefact</a> and <a href="/repository/versions<?= $projParam ?>">version</a> metadata to link to transcriptions or facsimiles.</p>
    </div>

    <div class="span6 well well-large">
        <h3>Align</h3>
        <p>To support efficient navigation between images and associated transcriptions, alignment is necessary. Align sections of transcriptions and facsimiles with the <a href="/alignment/edit<?= $projParam ?>">Alignment Tool</a>.</p>
    </div>
</div>
<div class="row-fluid">
    <div class="span12 well well-large">
        <h3>Compare and Collate</h3>
        <p>Textual and material variation provides important clues about the transmission of text from one version to another. The AustESE Workbench contains a variety of comparison tools.</p>
        <p>Compare images using the <a href="/lightbox<?= $projParam ?>">Light Box</a>.</p>
        <p>To compare textual variation, create an MVD from selected transcription resources via the Send To menu in the <a href="/repository/resources<?= $projParam ?>">Digital Resource Organiser</a>.</p>
        <p>View existing MVDs as a <a href="/collationtools/compare<?= $projParam ?>">side-by-side</a> view or <a href="/collationtools/apparatus<?= $projParam ?>">table apparatus</a> <!--via the same menu or from individual resource metadata record pages.--></p>
    </div>
</div>
<div class="row-fluid">
    <div class="span12 well well-large">
        <h3>Annotate</h3>
        <p>Create explanatory and textual notes as annotations.</p>
        <p>Annotation is a fundamental activity in any scholarship. The AustESE Workbench integrates an annotation tool that enables notes to be attached to images and transcriptions under a variety of categories, such as textual notes, explanatory notes, and tags. Depending on the needs of the editorial project, annotations can be either a solitary or collaborative endeavour. With author attribution and clearly defined categories and tags, annotations can be <a href="/annotations/<?= $projParam ?>">searched</a>, filtered or generated as themed lists.  
    </div>
</div>
<div class="row-fluid">
    <div class="span12 well well-large">
        <h3>The AustESE Workbench</h3>
        <p>Throughout 2013, these components have been integrated into the AustESE Workbench, an environment where projects can be created and managed as solitary or collaborative endeavours. A project creator can invite collaborators, assign roles and manage access privileges. This enables the tasks of scholarly editing to be conducted in an environment that is as open or closed to wider scrutiny as the project creator desires.</p>
        <p>With the ability to manage levels of access, the AustESE Workbench can serve as a publication platform, or it can provide a conduit to other publication formats with various export options such as .DOC, EPUB, TEI/XML, PDF. These functions will be implemented in the second half of 2013.</p> 
    </div>
</div>
