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
            '#deleteButton': {
                click: this.promptDeleteResources
            },
            "#toggleFullscreenButton": {
                click: this.toggleFullscreen
            },
            '#helpButton': {
                click: this.displayHelp
            },
            // thumbnailpanel filter and sort handler are implemented in ThumbnailPanel 
            'thumbnailview': {
                selectionchange: this.editResourceMetadata,
                itemdblclick: this.displayResource
            },
            'resourcegrid':{
                selectionchange: this.editResourceMetadata
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
            // propertiespanel cancel is implemented in PropertiesPanel
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
            'selectpropertieswindow button[text="Cancel"]': {
                click: this.cancelUpdateEditorFields
            }, 
            'selectpropertieswindow button[text="Select All"]': {
                click: this.selectAllCheckboxes
            }
        });
    },
    resizeUI: function(w, h){
        // force resize and repositioning of app when window resizes
        var uiPanel = Ext.ComponentQuery.query("mainpanel")[0];
        var placeholder = Ext.get('uploaderui');
        var newHeight = h - (placeholder.getY());
        var newWidth = w - placeholder.getX()*2;
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
    addResources: function(button, filelist){
        button.up('mainpanel').down('statusbar').showBusy();
        console.log(arguments);
        var modulePath = this.application.modulePath;
        var form = button.up('form').getForm();
        
            form.submit({
                url: modulePath + '/api/resources/',
                //waitMsg: 'Uploading files...',
                success: function(fp, o) {
                    //msg('Success', 'Processed file "' + o.result.file + '" on the server');
                    //console.log("success",arguments)
                    Ext.getStore("ResourceStore").load();
                },
                failure: function(){
                    //console.log("fail",arguments)
                    Ext.getStore("ResourceStore").load();
                }
            });
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
                buttons: Ext.Msg.YESNO,
                fn: function(buttonId){
                    if(buttonId=='yes'){
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
    editResourceMetadata: function(view, selections) {
       // if (/* form is dirty */) {
            // prompt to save data
       // } else {
            Ext.ComponentQuery.query('propertiespanel')[0].loadRecords(selections);
       // }
    },
    displayResource: function(dataview, record, item, index, e, eOpts){
        // TODO: allow preview display of multiple resources?
        var uri = record.get('uri');
        var msg = '';
        window.open('resources/' + record.get('id'));
        window.focus();
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
        .getLayout().getActiveItem() // the active editor form
        .down('fieldset'); // the first fieldset (i.e. metadata)
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
        var metadataFieldSet = Ext.ComponentQuery.query('propertiespanel')[0] // the propertiespanel
            .getLayout().getActiveItem() // the active editor form
            .down('fieldset'); // the first fieldset (i.e. metadata)
        var existingFields = win.existingFields;
        metadataFieldSet.items.each(
            function(f){
                // remove deselected fields (title and description are always shown)
                var fieldname = win.single? f.name : f.itemId;
                
                // for multi-form we look at field containers (itemId is appended with 'fc')
                if (fieldname != ('description' + (win.single? '' : 'fc')) 
                        && fieldname != ('title' + (win.single? '' : 'fc')) 
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
                        fieldLabel: Ext.util.Format.capitalize(p)
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
    cancelUpdateEditorFields: function(button) {
        button.up('window').close();
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
            activeForm.down('fieldset').items.each(function(f){
                if (f.down("checkboxfield").getValue()){
                    // get value from textfield or textarea
                    var valueField = f.down("textfield") || f.down("textarea");
                    newValues[valueField.name] = valueField.getValue();
                }
            });
            if (!this.isEmptyObject(newValues)){
                for (var i = 0 ; i < l; i++){
                    // update each record with new values
                    var rec = propertiespanel.loadedRecords[i];
                    rec.set(newValues);
                    rec.commit();
                    // copy metadata fields only into newValues to send to database
                    var nonMetadataFields = {'filename':1,'dateString':1,
                            'filelength':1,'id':1,'sizeString':1,
                            'thumbnailUri':1,'uploaddate':1,'uri':1, 
                            'shortName':1};
                    Ext.Object.each(rec.data,function(key, val, obj){
                        if (!nonMetadataFields[key]){
                            newValues[key]=val;
                        }
                    });
                    // save values to database
                    this.updateData(rec.get('uri'),newValues);
                    //console.log("newvals",newValues);
                }
            }
        }
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
    }
});
