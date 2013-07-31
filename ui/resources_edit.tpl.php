<div id="successMessage" style="display:none" class="alert alert-success">
  <a href="#" data-dismiss="alert"class="close">x</a>
  <span class="label label-success">Success</span> Resource has been updated. Return to <a href="/repository/resources/<?php print arg(3); ?>">View Resource</a> page.
</div>
<div id="failureMessage" style="display:none" class="alert alert-error">
  <a href="#" data-dismiss="alert" class="close">x</a>
  <span id="failMessage"></span>
</div>

<textarea id="editor" name="editor" cols="100" rows="1"> 
</textarea>
<div class="form-actions">
<button data-resource="/<?php print drupal_get_path('module', 'repository');?>/api/resources/<?php print arg(3); ?>" class="btn btn-primary" title="Save as new version" id="savebtn">Save</button>
<button data-resource="/<?php print drupal_get_path('module', 'repository');?>/api/resources/<?php print arg(3); ?>" class="pull-right btn" title="Preview hhow this resource will appear when rendered from TEI/XML" id="previewbtn">Preview</button>
</div>
<div id="preview"></div>