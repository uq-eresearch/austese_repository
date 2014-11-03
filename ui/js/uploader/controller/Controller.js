Ext.define('austese_uploader.controller.Controller', {
    extend: 'Ext.app.Controller',
    init: function(application) {
        Ext.EventManager.onWindowResize(this.resizeUI, this);
        this.control({
            "mainpanel": {
                restore: function(){
                    this.resizeUI(Ext.Element.getViewportWidth(),Ext.Element.getViewportHeight());
                },
                afterrender: function(){
                    this.resizeUI(Ext.Element.getViewportWidth(),Ext.Element.getViewportHeight());
                }
            },
            '#addButton': {
                fileselected: this.addResources
            },
            '#newButton': {
                click: this.newResource
            },
            '#deleteButton': {
                click: this.promptDeleteResources
            },
            "#toggleFullscreenButton": {
                click: this.toggleFullscreen
            },
            '#helpButton': {
                click: this.displayHelp
            },
            '#homeButton': {
                click: function(){
                    document.location.href='/';
                }
            },
            // thumbnailpanel filter and sort handler are implemented in ThumbnailPanel
            'thumbnailview': {
                selectionchange: this.displayResourceMetadata,
                itemdblclick: this.displayResource
            },
            'propertiespanel button[iconCls="editIcon"]': {
                click: this.editResourceMetadata
            },
            'propertiespanel fieldcontainer textfield': {
                change: this.onFocusMultiField
            },
            'propertiespanel splitbutton[iconCls="sendToIcon"]': {
                arrowclick: this.displaySendToMenu,
                click: this.displaySendToMenu
            },
            'resourcegrid':{
                selectionchange: this.displayResourceMetadata,
                itemdblclick: this.displayResource
            },
            '#rotateleft': {
                click: function(button, e, options){
                    this.rotateImages(false);
                }
            },
            '#rotateright': {
                click: function(button, e, options) {
                    this.rotateImages(true);
                }
            },
            'propertiespanel button[text="Save"]': {
                click: this.updateRecords
            },
            'propertiespanel button[text="Cancel"]': {
                click: this.cancelEdit
            },
            '#thumbnailsButton': {
                click: this.toggleResourceView
            },
            '#gridButton':{
                click: this.toggleResourceView
            },
            'sendtomvdwindow button[text="Cancel"]': {
                click: this.cancelWindow
            },
            'sendtomvdwindow button[text="OK"]':{
                click: this.createMVD
            },
            'newcollectionwindow button[text="OK"]':{
                click: this.createCollection
            },
            'newresourcewindow button[text="OK"], duperesourcewindow button[text="OK"]':{
                click: this.createResource
            },
            'newresourcewindow button[text="Cancel"], duperesourcewindow button[text="Cancel"], newcollectionwindow button[text="Cancel"]':{
                click: this.cancelWindow
            }
        });
        // listener to init select resources when resources are loaded into store
        Ext.getStore('ResourceStore').on('load',this.initSelectResources,{single:true});
    },
    initSelectResources: function(){
        var urlsplit = document.location.href.split('#');
        if (urlsplit.length > 1){
            var selModel = Ext.ComponentQuery.query('thumbnailview')[0].getSelectionModel();
            var store = selModel.getStore();
            var idsplit = urlsplit[1].split(';');
            var records = [];
            for (var i = 0; i < idsplit.length; i++){
                // find resource record with matching id and add to records array
                var id = idsplit[i];
                if (id){
                    var rec = store.getById(id);
                    if (rec && rec != -1){
                        records.push(rec);
                    }
                }
            }
            if (records.length > 0){
                selModel.select(records);
            }
        }
    },
    resizeUI: function(w, h){
        // force resize and repositioning of app when window resizes
        var uiPanel = Ext.ComponentQuery.query("mainpanel")[0];
        var placeholder = Ext.get('uploaderui');
        var newHeight = h - placeholder.getY();
        var newWidth = w - placeholder.getX() - 20;
        placeholder.setHeight(newHeight);
        uiPanel.setHeight(newHeight);
        placeholder.setWidth(newWidth);
        uiPanel.setWidth(newWidth);
        uiPanel.showAt(placeholder.getX(), placeholder.getY());
    },
    toggleResourceView: function(button, e, options){
        var resourcePanel = button.up('thumbnailpanel');
        var grid = resourcePanel.down('grid');
        var thumbs = resourcePanel.down('thumbnailview');
        if (button.itemId == 'gridButton'){
            resourcePanel.getLayout().setActiveItem(1);
            // make sure selections are the same (and suppress firing events while doing so)
            grid.getSelectionModel().select(thumbs.getSelectionModel().getSelection(),false,true);
        } else {
            resourcePanel.getLayout().setActiveItem(0);
            thumbs.getSelectionModel().select(grid.getSelectionModel().getSelection(),false,true);
        }
    },
    newResource: function(button){
        Ext.create('austese_uploader.view.NewResourceWindow').show();
    },
    duplicateResource: function(button){
        var dwindow = Ext.create('austese_uploader.view.DuplicateResourceWindow');
        dwindow.show();
        var pp = button.up('propertiespanel');
        dwindow.record = pp.loadedRecords[0];
        dwindow.getForm.findField("filename").setValue("Copy of " + record.get("filename"));
    },
    postResource : function(content, size, filetype, filename){
        var blob = new Blob([content], {
            size: size,
            type: filetype
        });
        // append the blob, providing the filename
        var data = new FormData();
        data.append('data',blob,filename);
        if (this.application.project) {
            data.append('project', this.application.project);
        }
        var headers = {};
        if (data.fake){
            headers=  {'Content-type': "multipart/form-data; boundary="+ data.boundary};
        }
        var modulePath = this.application.modulePath;
        jQuery.ajax({
            url:  modulePath + '/api/resources/',
            data: data,
            headers: headers,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(d){
                Ext.getStore("ResourceStore").load();
            },
            failure: function(response){
                Ext.ComponentQuery.query('statusbar')[0].setStatus({
                    iconCls: 'x-status-error',
                    text: "Unable to create resource: " + response.responseText,
                    clear: true
                });
            }
        });
    },
    createResource: function(button){

        var extwindow = button.up("window");
        var windowId = extwindow.getItemId();
        var filename = extwindow.down('form').getForm().findField("filename").getValue() || "transcription";
        var filetype, content, size;
        // determine whether this is a new or duplicated resource
        if (windowId == "newresourcewindow"){
            filetype = extwindow.down('form').getForm().findField("filetype").getGroupValue() || "text/plain";
            // create a blob to represent the contents of the new transcription (simulates file)
            if (filetype == "text/xml"){
                content = "<TEI></TEI>";
                size = 11;
            } else {
                content = "";
                size = 0;
            }
            this.postResource(content, size, filetype, filename);
        } else {
            // get value from original resource record
            filetype = extwindow.record.get('filetype');
            // get content from existing record
            var controller = this;
            jQuery.ajax({
                url: extwindow.record.get('uri'),
                dataType: 'text',
                success: function(rescontent){
                    controller.postResource(rescontent, rescontent.length, filetype, filename);
                    // TODO: duplicate resource metadata as well as content
                },
                scope: this
            })
        }
        extwindow.close();

    },
    addResources: function(button, filelist){
        button.up('mainpanel').down('statusbar').showBusy();
        var modulePath = this.application.modulePath;
        var form = button.up('form').getForm();
        for(var i = 0; i < filelist.length; i++){
            var file = filelist[i];
            var data = new FormData();
            data.append('data',file);
            if (this.application.project) {
                data.append('project', this.application.project);
            }
            var headers;
            if (data.fake){
                headers=  {'Content-type': "multipart/form-data; boundary="+ data.boundary};
            }
            jQuery.ajax({
                url:  modulePath + '/api/resources/',
                data: data,
                headers: headers,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data){
                    Ext.getStore("ResourceStore").load();
                }
            });
        }
    },

    promptDeleteResources: function(button, e, options){
        var selections = button.up('thumbnailpanel').getLayout().getActiveItem().getSelectionModel().getSelection();
        var numResources = selections.length;
        var controller = this;
        if (numResources > 0){
            Ext.Msg.show({
                title: 'Confirm deletion',
                msg: 'Are you sure you wish to delete '
                    + numResources + ' selected resource' + (numResources != 1? 's': '') + '?',
                buttons: Ext.Msg.OKCANCEL,
                fn: function(buttonId){
                    if(buttonId=='ok'){
                        controller.deleteResources(selections);
                    }
                }
            });
        } else {
            button.up('mainpanel').down('statusbar').setStatus({
                text: 'No resources selected to delete',
                clear: true
            });
        }
    },
    toggleFullscreen: function(button, e, options){
        button.up('mainpanel').toggleMaximize();
        if (button.iconCls=='exitFullscreenIcon') {
            button.setIconCls('fullscreenIcon');
        } else {
            button.setIconCls('exitFullscreenIcon');
            // prevent overflow
            var placeholder = Ext.get('uploaderui');
            placeholder.setHeight(0);
            Ext.getBody().scrollTo('top',0);
        }
    },
    displayHelp: function() {
        Ext.create('Ext.window.Window',{
            title: 'AustESE Uploader Help',
            width: 400,
            cls: 'helpWindow',
            bodyPadding: 5,
            height: 300,
            resizable: true,
            autoScroll: true,
            autoLoad: {
                url: this.application.modulePath + '/ui/uploaderhelp.html',
            }
        }).show();
    },
    onFocusMultiField: function(f, newValue, oldValue){
        var name = f.getName();
        var pp = f.up("propertiespanel");
        var setValue = pp.aggregatedValues[name];
        //check box if value is changed from what was originally set
        if (newValue != setValue && setValue != undefined){
            f.up("fieldcontainer").down("checkboxfield").setValue(1);
        } else {
            f.up("fieldcontainer").down("checkboxfield").setValue(0);
        }
    },

    editResourceMetadata: function(button){
        var pp = button.up('propertiespanel');
        var records = pp.loadedRecords;
        var aggregatedValues = pp.aggregatedValues;
        var l = records.length;
        var layout = pp.getLayout();
        var s = l !== 1 ? 's' : '';
        pp.setTitle('Editing ' + l + ' resource' + s);
        /*if (records[0].get('filetype').match("image") || aggregatedValues.filetype.match("image")){
            // only show image rotation tools if at least one image is selected
            pp.down('toolbar').show();
        }*/
        if (l == 1){
            // show single record editing UI
            layout.setActiveItem(pp.EDITSINGLE);
            layout.getActiveItem().getForm().loadRecord(records[0]);
        } else if (l > 0) {
            layout.setActiveItem(pp.EDITMULTI);
            layout.getActiveItem().getForm().setValues(aggregatedValues);
        }
    },
    displayResourceMetadata: function(view, records) {
        var pp = Ext.ComponentQuery.query('propertiespanel')[0];
        var layout = pp.getLayout();
        var activeItem = layout.getActiveItem();
        if (activeItem && activeItem.getForm){
            var form = layout.getActiveItem().getForm();
            if (form.isDirty) {
                // TODO: prompt to save data

            }
        }
        pp.loadedRecords = records;
        var l = records.length;
        var s = l !== 1 ? 's' : '';
        pp.down('toolbar').hide();
        layout.setActiveItem(pp.VIEWONLY);
        form = layout.getActiveItem().getForm();
        if (l > 0){
            pp.setTitle(l + ' resource' + s + " selected");
        } else {
            pp.setTitle('No resources selected');
        }
        // add selected ids to href after frag id to allow bookmarking selection
        var ids="";
        for (var i = 0; i < records.length; i++){
            ids += records[i].get("id") + ";";
        }
        document.location.href = document.location.href.split('#')[0] + "#" + ids;
        var aggregatedValues;
        if (l == 1){
            form.loadRecord(records[0]);
            // show metadata
            layout.getActiveItem().down('fieldset[title="Metadata"]').show();
            layout.getActiveItem().down('displayfield[name="filename"]').show();

        } else if (l > 0) {
            //  display values for upload date, size and type are aggregated
            aggregatedValues = {filetype:''};
            var aggregatedTypes = {};
            var minDate = records[0].get('uploaddate'),
                maxDate = minDate;
            var totalFileLength = 0;
            for (var i = 0; i < l; i++){
                var currentRecord = records[i];
                var fieldNames = ['title','description','project','coverage','format','language','publisher', 'rights','source'];
                // display first non null value for each field from any record
                for (var f = 0; f < fieldNames.length; f++){
                    var fld = fieldNames[f];
                    aggregatedValues[fld] = aggregatedValues[fld] || currentRecord.get(fld);
                }
                // aggregate file length and calculate min and max dates
                totalFileLength += currentRecord.get('filelength');
                var date = currentRecord.get('uploaddate');
                var type = currentRecord.get('filetype');
                if (minDate > date) {
                    minDate = date;
                }
                if (maxDate < date) {
                    maxDate = date;
                }
                // keep tally of number of resources for each type
                if (aggregatedTypes[type]) {
                    aggregatedTypes[type]++;
                } else {
                    aggregatedTypes[type] = 1;
                }
            }
            aggregatedValues.sizeString = Ext.util.Format.fileSize(totalFileLength) + " in total";
            var formattedMinDate = Ext.util.Format.date(minDate, "d/m/Y g:i a"),
                formattedMaxDate = Ext.util.Format.date(maxDate, "d/m/Y g:i a");
            if (formattedMinDate != formattedMaxDate){
                aggregatedValues.dateString = "Between " + formattedMinDate + " and " + formattedMaxDate;
            } else {
                aggregatedValues.dateString = formattedMinDate;
            }
            for (t in aggregatedTypes) {
                aggregatedValues.filetype += t + " (" + aggregatedTypes[t] + ")<br/>";
            }
            console.log("aggregated values are",aggregatedValues)
            form.setValues(aggregatedValues);
            // hide metadata
            layout.getActiveItem().down('fieldset[title="Metadata]').hide();
            layout.getActiveItem().down('displayfield[name="filename"]').hide();

        } else {
            // show no resources card
            layout.setActiveItem(pp.NONESELECTED);
        }
        pp.aggregatedValues = aggregatedValues;

    },
    displayResource: function(dataview, record, item, index, e, eOpts){
        var uri = record.get('uri');
        document.location.href = 'resources/' + record.get('id') + this._getProjectParam({isFirstParam: true});
    },
    rotateImages: function(clockwise) {
        // for all selected records
        // check whether they are images
        // if image: use jquery to rotate preview in thumbnail view
        //           flag for rotation on server in properties editor
        Ext.Msg.show({
            title:"Watch this space",
            msg: "Image rotation feature is still being developed",
            buttons: Ext.Msg.OK
        });
    },
    cancelWindow: function(button) {
        button.up('window').close();
    },
    cancelEdit: function(button){
        var pp = button.up('propertiespanel');
        var ppLayout = pp.getLayout();
        ppLayout.getActiveItem().getForm().reset();
        ppLayout.setActiveItem(pp.VIEWONLY);
        pp.down('toolbar').hide();
    },
    updateRecords: function(button){
        Ext.ComponentQuery.query('statusbar')[0].showBusy();
        var propertiespanel = button.up('propertiespanel');
        var l = propertiespanel.loadedRecords.length;
        var activeForm = propertiespanel.getLayout().getActiveItem();
        if (l == 1) {
            // update all values from form into record
            activeForm.getForm().updateRecord();
            var rec = activeForm.getForm().getRecord();
            rec.commit();
            var vals = activeForm.getValues();
            vals.filetype = rec.get('filetype');
            this.updateData(rec.get('uri'), vals);
        } else {
            // get new values from form (only where checkbox is checked)
            var newValues = {};
            activeForm//.down('fieldset')
                .items.each(function(f){
                if (f.down("checkboxfield").getValue()){
                    // get value from textfield or textarea
                    var valueField = f.down("textfield") || f.down("textarea");
                    newValues[valueField.name] = valueField.getValue();
                }
            });
            if (!this.isEmptyObject(newValues)){
                for (var i = 0 ; i < l; i++){
                    var thisRecNewValues = {};
                    Ext.apply(thisRecNewValues, newValues)
                    // update each record with new values
                    var rec = propertiespanel.loadedRecords[i];
                    rec.set(thisRecNewValues);
                    rec.commit();
                    // copy metadata fields only into newValues to send to database
                    var nonMetadataFields = {'filename':1,'dateString':1,
                            'filelength':1,'id':1,'sizeString':1,
                            'thumbnailUri':1,'uploaddate':1,'uri':1,
                            'shortName':1};
                    Ext.Object.each(rec.data,function(key, val, obj){
                        if (!nonMetadataFields[key]){
                            thisRecNewValues[key]=val;
                        }
                    });
                    // save values to database
                    this.updateData(rec.get('uri'),thisRecNewValues);
                }
            }
        }
        // return to view only view
        this.cancelEdit(button);
    },
    isEmptyObject: function(obj){
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    },
    updateData: function(uri, data){
        Ext.Ajax.request({
            url: uri,
            method: 'PUT',
            jsonData: data,
            success: function(response, options){
                Ext.ComponentQuery.query('statusbar')[0].setStatus({
                    text: 'Metadata saved',
                    clear: true
                });
            },
            failure: function(response, options){
                Ext.ComponentQuery.query('statusbar')[0].setStatus({
                    iconCls: 'x-status-error',
                    text: "Unable to update resource: " + response.responseText,
                    clear: true
                });
            }
        });
    },
    deleteResources: function(records) {
        var continueDeleting = true;
        var deletedCount = 0;
        for (var i = 0; i < records.length && continueDeleting; i++){
            var rec = records[i];
            Ext.Ajax.request({
                url: rec.get('uri'),
                method: 'DELETE',
                success: function(response, options){
                    deletedCount++;
                    if (deletedCount = records.length){
                        Ext.ComponentQuery.query('statusbar')[0].setStatus({
                            iconCls: 'x-status-error',
                            text: "Deleted " + deletedCount + " resources. ",
                            clear: true
                        });
                        Ext.getStore('ResourceStore').remove(records);
                    }
                },
                failure: function(response, options){
                    continueDeleting = false;
                    Ext.ComponentQuery.query('statusbar')[0].setStatus({
                        iconCls: 'x-status-error',
                        text: (deletedCount > 0? "Deleted " + deletedCount + " resources. ":"")
                            + "Unable to delete resource: " + response.responseText,
                        clear: true
                    });
                }
            });
        }
    },
    displaySendToMenu: function(button, e){
        // populate menu with custom options depending on what resources are selected
        var pp = button.up('propertiespanel');
        var records = pp.loadedRecords;
        var aggregatedValues = pp.aggregatedValues;

        button.menu.removeAll();
        var filetype = (aggregatedValues && aggregatedValues.filetype) || records[0].get('filetype');
        if (filetype && filetype.match('image') && this.application.enableLightBox==1){
            button.menu.add({
                text: 'Light Box',
                iconCls: 'lightBoxIcon',
                tooltip: 'Add selected images(s) to Light Box',
                scope: this,
                handler: this.sendToLightBox
            });
        }
        if (filetype && (filetype.match('xml') ||  filetype.match('text'))){
            if(this.application.enableCollation==1){
                button.menu.add({
                    text: 'MVD',
                    iconCls: 'addMVDIcon',
                    tooltip: 'Add selected transcription(s) to MVD',
                    handler: this.sendToMVD,
                    scope: this
                });
            }
            // single text or xml resource selected
            if (records.length == 1){
                var record = records[0];
                button.menu.add({
                    text: 'Transcription editor',
                    iconCls: 'transcriptionEditorIcon',
                    tooltip: 'Edit selected transcription',
                    scope: this,
                    handler: function(){
                        document.location.href ='/repository/resources/edit/' + record.get('id') + this._getProjectParam({isFirstParam: true});
                    }}
                );
                button.menu.add({
                    text: 'Multi-Transcription editor',
                    iconCls: 'transcriptionEditorIcon',
                    tooltip: 'Edit selected transcription using multi-editor',
                    scope: this,
                    handler: function(){
                        document.location.href ='/repository/resources/edit/' + record.get('id') + '?multi=true' + this._getProjectParam({isFirstParam: false});;
                    }}
                );
                record = records[0];
                button.menu.add({
                    text: 'Duplicate resource',
                    iconCls: 'duplicateResourceIcon',
                    tooltip: 'Create an exact duplicate of this resource',
                    handler: this.duplicateResource
                });
            }
            // any number of text or xml resources selected
           /* button.menu.add({
                    text: 'Create Version' + (records.length == 1? "":"s"),
                    //iconCls: 'lightBoxIcon',
                    tooltip: 'Create VersionPart / Version records',
                scope: this,
                    handler: this.createVersionRecords
            });*/
        }




        // any number of generic resources selected
       /* button.menu.add({
            text: 'Create Artefact' + (records.length == 1? "":"s"),
            tooltip: 'Create ArtefactPart / Artefact records',
            scope: this,
            handler: this.createArtefactRecords
        });*/

        // generic single resource selected
        if (records.length == 1){
            var record = records[0];
            button.menu.add({
                text: 'View resource record',
                tooltip: 'View resource metadata',
                iconCls: 'viewResourceRecordIcon',
                scope: this,
                handler: function(){
                    document.location.href ='/repository/resources/' + record.get('id') + this._getProjectParam({isFirstParam: true});
                }}
            );
            button.menu.add({
                text: 'View resource content',
                iconCls: 'viewResourceIcon',
                tooltip: 'View resource content',
                handler: function(){
                    document.location.href ='/repository/resources/' + record.get('id') + "/content";
                }}
            );

        }
        button.menu.add({
            text: 'Create Collection',

            tooltip: 'Create collection to group records',
            scope: this,
            handler: this.sendToCreateCollection
        });
        // if a transcription and an image are selected, add align tool as an option
         if (this.application.enableAlignment==1 && records.length == 2
                && filetype && filetype.match('image') && (filetype.match('text')|| filetype.match('xml'))) {
            button.menu.add({
                text: 'Alignment tool',
                tooltip: 'Align sections of selected image and transcription',
                handler: this.sendToAlignmentTool,
                scope:this
            });
        }
        // force menu to show
        button.showMenu(e);
    },
    // send to handlers
    sendToMVD: function(button){
        var pp = button.up('propertiespanel');
        var records = pp.loadedRecords;
        var ids='';
        var count = 0;
        var otherFiles = false;
        // for each selected resource that is a transcription (i.e. not an image)
        for (var i = 0; i < records.length; i++){
            if (records[i].get('filetype').match('xml') || records[i].get('filetype').match('text')){
                ids+=records[i].get("id") +";";
                count++;
            } else {
                otherFiles = true;
            }
        }
        var sendToMVDWindow = Ext.create('austese_uploader.view.SendToMVDWindow',{
            count: count,
            ids: ids,
            project: this.application.projectShortName
        });
        if (otherFiles){
            Ext.Msg.show({
                title:"Incompatible files selected",
                msg: "Only text and XML files will be sent to MVD",
                buttons: Ext.Msg.OKCANCEL,
                fn: function(buttonId){
                    console.log("button",buttonId)
                    if(buttonId=='ok'){
                        sendToMVDWindow.show();
                    }
                }
            });
        } else {
            sendToMVDWindow.show();
        }

    },
    createMVD: function(button){
      var mvdWin = button.up('window');
      var ids = mvdWin.ids;
      var formValues = mvdWin.down('form').getForm().getValues();
      // TODO strip spaces and any other illegal characters
      var docpath = (formValues.project? formValues.project : "")
          + (formValues.work? '%2f' + formValues.work : "")
          + (formValues.section? '%2f' +  formValues.section : "")
          + (formValues.subsection? '%2f'+ formValues.subsection : "");
      var filter = formValues.filter;
      mvdWin.close();
      Ext.ComponentQuery.query('statusbar')[0].setStatus({
          iconCls: 'x-status-info',
          text: "MVD creation page opened in another tab",
          clear: true
      });
      window.open('/collationtools/sendtomvd/' + ids + "?docpath=" + docpath  + this._getProjectParam({isFirstParam: false}) + "&filter=" + filter);
    },
    sendToLightBox: function(button){
        var pp = button.up('propertiespanel');
        var records = pp.loadedRecords;
        var ids="";
        for (var i = 0; i < records.length; i++){
            if (records[i].get('filetype').match('image')){
                ids += records[i].get("id") + ";";
            }
        }
        // TODO: use HTML 5 postMessage to send to lightbox if already open
        document.location.href ='/lightbox' + this._getProjectParam({isFirstParam: true}) +'#' + ids;
    },
    sendToAlignmentTool: function(button){
        var pp = button.up('propertiespanel');
        var records = pp.loadedRecords;
        var imageId="", textId="";
        for (var i = 0; i < records.length; i++){
            if (records[i].get('filetype').match("image")) {
                imageId = records[i].get("id") ;
            } else {
                textId = records[i].get("id");
            }
        }
        document.location.href ='/alignment/edit/' + imageId + "/" + textId + this._getProjectParam({isFirstParam: true});
    },
    sendToCreateCollection: function(button){
        var pp = button.up('propertiespanel');
        var records = pp.loadedRecords;
        var ids=[];
        for (var i = 0; i < records.length; i++){
            ids.push(records[i].get("id"));
        }
        Ext.create('austese_uploader.view.NewCollectionWindow',{
            ids: ids,
            project: this.application.project
        }).show();
    },
    createCollection: function(button){
        var collWin = button.up('window');
        var collectionData = {
                resources : collWin.ids,
                name : collWin.down('form').getForm().getValues().name
        };
        collWin.close();
        // save collection
        var modulePath = this.application.modulePath;
        jQuery.ajax({
          type: 'POST',
          data: JSON.stringify(collectionData),
          context: this,
          headers: {
              'Content-Type': 'application/json'
          },
          url: modulePath + "/api/collections/",
          success: function(d){
              window.location.href = "/repository/collections/" + d.id + this._getProjectParam({isFirstParam: true});
          },
          failure: function(response){
              Ext.ComponentQuery.query('statusbar')[0].setStatus({
                  iconCls: 'x-status-error',
                  text: "Unable to create collection: " + response.responseText,
                  clear: true
              });
          }
        });
    },
    _getProjectParam: function(obj) {
        if (this.application.project) {
            var firstChar = '';
            if (obj && obj.isFirstParam) {
                firstChar = '?';
            } else {
                firstChar = '&';
            }
            return firstChar + 'project='+ this.application.project;
        } else {
            return '';
        }
    },
    createArtefactRecords: function(button){
        // pop up a dialog box to configure whether to create an artefact part for each, a single artefact to group (or both - will group artefact parts in this case)
        // display info : selected x facsimiles, y diplomatic transcriptions

    },
    createVersionRecords: function(button){
        // pop up dialog box to configure whether to create version part for each, single version with multiple transcriptions, or both (single version with multiple parts)
        // display info: selected x transcriptions

    }
});
