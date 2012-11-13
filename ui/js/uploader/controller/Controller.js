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
            "#toggleFullscreenButton": {
                click: this.toggleFullscreen
            },
            'thumbnailpanel #helpButton': {
                click: this.displayHelp
            },
            // thumbnailpanel filter and sort handler are implemented in ThumbnailPanel 
            'thumbnailview': {
                selectionchange: this.editResourceMetadata,
                itemdblclick: this.displayResource
            },
            'propertiespanel #rotateleft': {
                click: function(button, e, options){
                    this.rotateImages(false);
                }
            },
            'propertiespanel #rotateright': {
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
            title: 'Help',
            width: 400,
            cls: 'helpWindow',
            bodyPadding: 5,
            height: 300,
            resizable: true,
            autoScroll: true,
            autoLoad: {
                url: '/sites/all/modules/austese_repository/ui/uploaderhelp.html',
            }
        }).show();
    },
    editResourceMetadata: function(dataview, selections) {
        Ext.ComponentQuery.query('propertiespanel')[0].loadRecords(selections);
    },
    displayResource: function(dataview, record, item, index, e, eOpts){
        // TODO: allow preview display of multiple resources?
        var uri = record.get('uri');
        var msg = '';
        if (record.get('filetype').match('image')){
            msg = '<img style="min-height:480px;margin:auto" src="' + uri + '">';
        } else {
            msg = 'No preview available';
        }
        Ext.Msg.show({
            title: record.get('filename'),
            // FIXME: use image dimensions to resize box
            msg: msg,
            minWidth:380,
            modal: true,
        });
    },
    rotateImages: function(clockwise) {
        // for all selected records
        // check whether they are images
        // if image: use jquery to rotate preview in thumbnail view
        //           flag for rotation on server in properties editor
        console.log('rotate ' + (clockwise? 'right' : 'left'));
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
        var propertiespanel = button.up('propertiespanel');
        var l = propertiespanel.loadedRecords.length;
        var activeForm = propertiespanel.getLayout().getActiveItem();
        if (l == 1) {
            // update all values from form into record
            activeForm.getForm().updateRecord();
            var rec = activeForm.getForm().getRecord();
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
            for (var i = 0 ; i < l; i++){
                // update each record with new values
                var rec = propertiespanel.loadedRecords[i];
                rec.set(newValues);
                // TODO get metadata fields from record only and apply new values
                var vals = Ext.apply(rec.data, newValues);
                
                // add filetype to values as it needs to be stored with metadata
                vals.filetype = rec.get('type');
                // save values to database
                this.updateData(rec.get('uri'),newValues);
            }
        }
    },
    updateData: function(uri, data){
        Ext.Ajax.request({
            url: uri,
            method: 'PUT',
            jsonData: data,
            success: function(response, options){
                console.log("success");
            },
            failure: function(response, options){
                console.log("failure",response);
                Ext.Msg.alert("Unable to update resource",response);
            }
        });
    }
});
