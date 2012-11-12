<div id="alerts"></div>
<form id="fileupload" enctype="multipart/form-data" method="POST" action="/<?php print drupal_get_path('module', 'repository'); ?>/api/resources/" class="form-horizontal">
        <div class="row fileupload-buttonbar">
            <div class="span7">
                <!-- The fileinput-button span is used to style the file input field as button -->
                <span class="btn btn-success fileinput-button">
                    <i class="icon-plus icon-white"></i>
                    <span>Add files...</span>
                    <input type="file" name="data" multiple>
                </span>
                <button type="submit" class="btn start">
                    <i class="icon-upload"></i>
                    <span>Start upload</span>
                </button>
                <button type="reset" class="btn cancel">
                    <i class="icon-ban-circle"></i>
                    <span>Cancel upload</span>
                </button>
                <!--button type="button" class="btn btn-danger delete">
                    <i class="icon-trash icon-white"></i>
                    <span>Delete</span>
                </button>
                <input type="checkbox" class="toggle"-->
            </div>
            <!-- The global progress information -->
            <div class="span5 fileupload-progress fade">
                <!-- The global progress bar -->
                <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    <div class="bar" style="width:0%;"></div>
                </div>
                <!-- The extended global progress information -->
                <div class="progress-extended">&nbsp;</div>
            </div>
        </div>
        <!-- The loading indicator is shown during file processing -->
        <div class="fileupload-loading"></div>
        <br>
        <!-- The table listing the files available for upload/download -->
        <table role="presentation" class="table table-striped"><tbody class="files" data-toggle="modal-gallery" data-target="#modal-gallery"></tbody></table>

  <!--fieldset>
    <div class="control-group">
      <label class="control-label" for="data">File</label>
      <div class="controls">
        <input name="data" type="file" class="input-xlarge" id="data">

        <p class="help-block">Select the file resource to upload</p>
      </div>
    </div>

<div class="controls">
    <input type="submit" class="btn" value="Save">
</div></div>
  </fieldset-->
</form>
	  </section>

    
  </div>
  <footer class="footer container">
      </footer>
</div>


	
<!-- modal-gallery is the modal dialog used for the image gallery -->
<div id="modal-gallery" class="modal modal-gallery hide fade" data-filter=":odd">
    <div class="modal-header">
        <a class="close" data-dismiss="modal">&times;</a>
        <h3 class="modal-title"></h3>
    </div>
    <div class="modal-body"><div class="modal-image"></div></div>
    <div class="modal-footer">
        <a class="btn modal-download" target="_blank">
            <i class="icon-download"></i>
            <span>Download</span>
        </a>
        <a class="btn btn-success modal-play modal-slideshow" data-slideshow="5000">
            <i class="icon-play icon-white"></i>
            <span>Slideshow</span>
        </a>
        <a class="btn btn-info modal-prev">
            <i class="icon-arrow-left icon-white"></i>
            <span>Previous</span>
        </a>
        <a class="btn btn-primary modal-next">
            <span>Next</span>
            <i class="icon-arrow-right icon-white"></i>
        </a>
    </div>
</div>
<!-- The template to display files available for upload -->
<script id="template-upload" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload fade">
        <td class="preview"><span class="fade"></span></td>
        <td class="name"><span>{%=file.filename%}</span></td>
        <td class="size"><span>{%=o.formatFileSize(file.length)%}</span></td>
        {% if (file.error) { %}
            <td class="error" colspan="2"><span class="label label-important">{%=locale.fileupload.error%}</span> {%=locale.fileupload.errors[file.error] || file.error%}</td>
        {% } else if (o.files.valid && !i) { %}
            <td>
                <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="bar" style="width:0%;"></div></div>
            </td>
            <td class="start">{% if (!o.options.autoUpload) { %}
                <button class="btn btn-primary">
                    <i class="icon-upload icon-white"></i>
                    <span>{%=locale.fileupload.start%}</span>
                </button>
            {% } %}</td>
        {% } else { %}
            <td colspan="2"></td>
        {% } %}
        <td class="cancel">{% if (!i) { %}
            <button class="btn btn-warning">
                <i class="icon-ban-circle icon-white"></i>
                <span>{%=locale.fileupload.cancel%}</span>
            </button>
        {% } %}</td>
    </tr>
{% } %}
</script>
<!-- The template to display files available for download -->
<script id="template-download" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-download fade">
        {% if (file.error) { %}
            <td></td>
            <td class="name"><span>{%=file.filename%}</span></td>
            <td class="size"><span>{%=o.formatFileSize(file.length)%}</span></td>
            <td class="error" colspan="2"><span class="label label-important">{%=locale.fileupload.error%}</span> {%=locale.fileupload.errors[file.error] || file.error%}</td>
        {% } else { %}
            <td class="preview">{% if (file.metadata && file.metadata.filetype && file.metadata.filetype.match("image")) { %}
                <a href="{%=file.uri%}" title="{%=file.filename%}" rel="gallery" download="{%=file.filename%}"><img style="max-width:150px" src="{%=file.uri%}"></a>
            {% } %}</td>
            <td class="name">
                <a href="{%=file.uri%}" title="{%=file.filename%}" rel="{%=file.thumbnail_url&&'gallery'%}" download="{%=file.filename%}">{%=file.filename%}</a>
            </td>
            <td class="size"><span>{%=o.formatFileSize(file.length)%}</span></td>
            <td colspan="2"></td>
        {% } %}
        <td class="delete">
            <button class="btn btn-danger" data-type="DELETE" data-url="{%=file.uri%}">
                <i class="icon-trash icon-white"></i>
                <span>{%=locale.fileupload.destroy%}</span>
            </button>
            <!--input type="checkbox" name="delete" value="1"-->
        </td>
    </tr>
{% } %}
</script>
</body>
</html>
