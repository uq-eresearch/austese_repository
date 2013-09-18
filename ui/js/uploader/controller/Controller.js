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
                selectionchange: this.displayResourceMetadata
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
            'propertiespanel #configuresingle': {
                click: function(){
                    this.launchConfigureEditorWindow(true);
                }
            },
            'propertiespanel #configuremulti': {
                click: function(){
                    this.launchConfigureEditorWindow(false);
                }
            },
            '#thumbnailsButton': {
                click: this.toggleResourceView
            },
            '#gridButton':{
                click: this.toggleResourceView
            },
            'selectpropertieswindow button[text="Update"]': {
                click: this.updateEditorFields
            },
            'selectpropertieswindow button[text="Cancel"], sendtomvdwindow button[text="Cancel"]': {
                click: this.cancelWindow
            }, 
            'selectpropertieswindow button[text="Select All"]': {
                click: this.selectAllCheckboxes
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
            // show file name field
            layout.getActiveItem().down('displayfield[name="filename"]').show();
            layout.getActiveItem().down('displayfield[name="title"]').show();
            
        } else if (l > 0) {
            //  display values for upload date, size and type are aggregated
            aggregatedValues = {
                    description: records[0].get('description'), 
                    title: records[0].get('title'),
                    project: records[0].get('project'),
                    filetype: ''
            };
            var aggregatedTypes = {};
            aggregatedTypes[records[0].get('filetype')] = 1;
            var minDate = records[0].get('uploaddate'), 
                maxDate = minDate;
            var totalFileLength = records[0].get('filelength');
            for (var i = 1; i < l; i++){
                var currentRecord = records[i];
                // display first non null title and description from any record 
                aggregatedValues.title = aggregatedValues.title || currentRecord.get('title');
                aggregatedValues.description = aggregatedValues.description || currentRecord.get('description');
                aggregatedValues.project = aggregatedValues.project || currentRecord.get('project');
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
            form.setValues(aggregatedValues);
            // TODO file name field
            layout.getActiveItem().down('displayfield[name="filename"]').hide();
            layout.getActiveItem().down('displayfield[name="title"]').hide();
            
        } else {
            // show no resources card
            layout.setActiveItem(pp.NONESELECTED);
        }
        pp.aggregatedValues = aggregatedValues;
        
    },
    displayResource: function(dataview, record, item, index, e, eOpts){
        var uri = record.get('uri');
        document.location.href = 'resources/' + record.get('id');
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
    launchConfigureEditorWindow: function(single){
        var metadataFieldSet = Ext.ComponentQuery.query('propertiespanel')[0] // the propertiespanel
        .getLayout().getActiveItem(); // the active editor form
        //.down('fieldset'); // the first fieldset (i.e. metadata)
        // make a list of existing fields in metadata editor to avoid creating duplicate fields
        var existingFields = [];
        metadataFieldSet.items.each(
            function(f){
                if (single){
                    existingFields.push(f.name);
                } else if (f.down('textfield')){
                    existingFields.push(f.down('textfield').name)
                }
            }
        );
       Ext.create('austese_uploader.view.SelectPropertiesWindow',
               {
                   single: single, 
                   existingFields: existingFields
               }
       ).show();
    },
    selectAllCheckboxes: function(button){
        button.up('window').down('form').items.each(function(c){
            c.setValue('on');
        });
    },
    updateEditorFields: function(button){
        var win = button.up('window');
        // read config values from window's form
        var config = win.down('form').getForm().getValues();
        var propertiespanel = Ext.ComponentQuery.query('propertiespanel')[0]
        var metadataFieldSet =  propertiespanel
            .getLayout().getActiveItem(); // the active editor form
            //.down('fieldset'); // the first fieldset (i.e. metadata)
        var existingFields = win.existingFields;
        var records = propertiespanel.loadedRecords;
        if (records.length > 0){
            var record = records[0];
        }
        metadataFieldSet.items.each(
            function(f){
                // remove deselected fields (title, description, shortname and project are always shown)
                var fieldname = win.single? f.name : f.itemId;
                
                // for multi-form we look at field containers (itemId is appended with 'fc')
                if (fieldname != ('description' + (win.single? '' : 'fc')) 
                        && fieldname != ('title' + (win.single? '' : 'fc')) 
                        && fieldname != ('shortname' + (win.single? '' : 'fc'))
                        && fieldname != ('project' + (win.single? '' : 'fc'))
                        && !config.hasOwnProperty((win.single? fieldname : fieldname.substring(0,fieldname.length - 2)))){
                    metadataFieldSet.remove(f);
                }
            }
        );
        for (var p in config) {
          if (config.hasOwnProperty(p) 
                  && config[p] == 'on' 
                      && !Ext.Array.contains(existingFields,p)){
                var fld;
                if (win.single){
                    fld = Ext.create('Ext.form.field.Text',{
                        name: p,
                        labelAlign: 'top',
                        fieldLabel: Ext.util.Format.capitalize(p),
                        value: (record? record.get(p): "")
                    });
                } else {
                    // for multi-form we add fieldcontainer with checkbox
                    fld = Ext.create('Ext.form.FieldContainer',{
                        hideLabel: true,
                        itemId: p + 'fc',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'checkboxfield',
                                flex: 0,
                                margins: '0 10 0 0',
                                name: 'update' + p,
                                hideLabel: true,
                                boxLabel: ''
                            },
                            {
                                xtype: 'textfield',
                                flex: 1,
                                name: p,
                                fieldLabel: Ext.util.Format.capitalize(p),
                                labelAlign: 'top'
                            }
                        ]
                    });
                }
                // add new field to first fieldset (metadata) in editor
                metadataFieldSet.add(fld);
          }
        }
        win.close();
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
        if (filetype && (filetype.match('xml') ||  filetype.match('text')) && this.application.enableCollation==1){
            button.menu.add({
                text: 'MVD',
                iconCls: 'addMVDIcon',
                tooltip: 'Add selected transcription(s) to MVD',
                handler: this.sendToMVD,
                scope: this
            });
            if (records.length == 1){
                var record = records[0];
                button.menu.add({
                    text: 'Transcription editor',
                    iconCls: 'transcriptionEditorIcon',
                    tooltip: 'Edit selected transcription',
                    handler: function(){
                        document.location.href ='/repository/resources/edit/' + record.get('id');
                    }}
                );
                button.menu.add({
                    text: 'Multi-Transcription editor',
                    iconCls: 'transcriptionEditorIcon',
                    tooltip: 'Edit selected transcription using multi-editor',
                    handler: function(){
                        document.location.href ='/repository/resources/edit/' + record.get('id') + '?multi=true';
                    }}
                );
                var record = records[0];
                button.menu.add({
                    text: 'Duplicate resource',
                    tooltip: 'Create an exact duplicate of this resource',
                    handler: this.duplicateResource
                });
            }
        }
        if (filetype && filetype.match('image') && this.application.enableLightBox==1){
            button.menu.add({
                text: 'Light Box',
                iconCls: 'lightBoxIcon',
                tooltip: 'Add selected images(s) to Light Box',
                scope: this,
                handler: this.sendToLightBox
            });
        }
        button.menu.add({
            text: 'Create Collection',
            
            tooltip: 'Create collection to group records',
            scope: this,
            handler: this.sendToCreateCollection
        });
        if (records.length == 1){
            var record = records[0];
            button.menu.add({
                text: 'View resource record',
                //iconCls: 'transcriptionEditorIcon',
                tooltip: 'View resource metadata record',
                handler: function(){
                    document.location.href ='/repository/resources/' + record.get('id');
                }}
            );
        }
        // if a transcription and an image are selected, add align tool as an option
       /* FIXME: alignment module needs to be fixed first
        * if (this.application.enableAlignment==1 && records.length == 2 
                && filetype && filetype.match('image') && (filetype.match('text')|| filetype.match('xml'))) {
            button.menu.add({
                text: 'Alignment tool',
                tooltip: 'Align sections of selected image and transcription',
                handler: this.sendToAlignmentTool
            });
        }*/
        // force menu to show
        button.showMenu(e);
    },
    // send to handlers
    sendToMVD: function(button){
        var pp = button.up('propertiespanel');
        var records = pp.loadedRecords;
        var ids='';
        var count = 0;
        // for each selected resource that is a transcription (i.e. not an image)
        for (var i = 0; i < records.length; i++){
            if (records[i].get('filetype').match('xml') || records[i].get('filetype').match('text')){
                ids+=records[i].get("id") +";";
                count++;
            }
        }
        // TODO: prompt for existing document id, 
        // but HRIT server import doesn't support adding to existing at present
        // however could look up existing MVD with some of these resources and offer to replace it
        Ext.create('austese_uploader.view.SendToMVDWindow',{
            count: count,
            ids: ids,
            project: this.application.project
        }).show();
        
        // redirect to collation module sendtomvd page
        // TODO: post the ids so they don't display in URL?
        
        
    },
    createMVD: function(button){
      var mvdWin = button.up('window');
      var ids = mvdWin.ids;
      var docpath = mvdWin;
      var formValues = mvdWin.down('form').getForm().getValues();
      // TODO strip spaces and any other illegal characters
      var docpath = (formValues.project? formValues.project : "")
          + (formValues.work? '%2f' + formValues.work : "")
          + (formValues.section? '%2f' +  formValues.section : "")
          + (formValues.subsection? '%2f'+ formValues.subsection : "");
      mvdWin.close();
      var progressWin = Ext.create('Ext.window.Window',{
          header:false, closable:false, modal: true, width:300,layout:'form',
          items:[
                 {xtype:'progressbar'},
                 {xtype: 'label', text: 'Creating MVD (this can take a long time)'}
          ]
      }).show();
      // show progress window so user knows something is happening (sendtomvd page takes awhile to load)
      progressWin.down('progressbar').wait();
      document.location.href='/collationtools/sendtomvd/' + ids + "?docpath=" + docpath;
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
        document.location.href ='/lightbox' + (this.application.project? '?project='+ this.application.project: '') +'#' + ids;
    },
    sendToAlignmentTool: function(button){
        var pp = button.up('propertiespanel');
        var records = pp.loadedRecords;
        var ids="";
        for (var i = 0; i < records.length; i++){
                ids += "/" + records[i].get("id") ;
        }
        document.location.href ='/alignment/edit' + ids;
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
          headers: {
              'Content-Type': 'application/json'
          },
          url: modulePath + "/api/collections/",
          success: function(d){
              window.location.href = "/repository/collections/" + d.id;
          }, 
          failure: function(response){
              Ext.ComponentQuery.query('statusbar')[0].setStatus({
                  iconCls: 'x-status-error',
                  text: "Unable to create collection: " + response.responseText,
                  clear: true
              });
          }
        });
    }
});
