Ext.define('austese_uploader.controller.Controller', {
    extend: 'Ext.app.Controller',
    init: function(application) {
        this.control({
            "thumbnailpanel button[text='Help']": {
                click: this.displayHelp
            },
            // thumbnailpanel filter and sort handler are implemented in ThumbnailPanel 
            "thumbnailview": {
                selectionchange: this.editResourceMetadata,
                itemdblclick: this.displayResource
            },
            "propertiespanel #rotateleft": {
                click: function(button, e, options){
                    this.rotateImages(false);
                }
            },
            "propertiespanel #rotateright": {
                click: function(button, e, options) {
                    this.rotateImages(true);
                }
            },
            // propertiespanel save and cancel are implemented in PropertiesPanel
            "propertiespanel #configuresingle": {
                click: function(){
                    this.launchConfigureEditorWindow(true);
                }
            },
            "propertiespanel #configuremulti": {
                click: function(){
                    this.launchConfigureEditorWindow(false);
                }
            },

            "selectpropertieswindow button[text='Update']": {
                click: this.updateEditorFields
            },
            "selectpropertieswindow button[text='Cancel']": {
                click: this.cancelUpdateEditorFields
            }, 
            "selectpropertieswindow button[text='Select All']": {
                click: this.selectAllCheckboxes
            }
        });
    },
    displayHelp: function() {
        Ext.create('Ext.window.Window',{
            title: 'Help',
            width: 300,
            height: 300,
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
        var msg = "";
        if (record.get("type").match("image")){
            msg = '<img style="min-height:480px;margin:auto" src="' + uri + '">';
        } else {
            msg = "No preview available";
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
        console.log("rotate " + (clockwise? "right" : "left"));
    },
    launchConfigureEditorWindow: function(single){
       Ext.create('austese_uploader.view.SelectPropertiesWindow',{single: single}).show();
    },
    selectAllCheckboxes: function(button){
        button.up('window').down('form').items.each(function(c){
            c.setValue("on");
        });
    },
    updateEditorFields: function(button){
        // read config values from window's form
        var config = button.up('window').down('form').getForm().getValues();
        var metadataFieldSet = Ext.ComponentQuery.query('propertiespanel')[0] // the propertiespanel
            .getLayout().getActiveItem() // the active editor form
            .down('fieldset'); // the first fieldset (i.e. metadata)
        
        // make a list of existing fields in metadata editor to avoid creating duplicate fields
        var existingFields = [];
        metadataFieldSet.items.each(
            function(f){
                // TODO: handle multi (don't remove fieldcontainers for title and description)
                
                // remove deselected fields (title and description are always shown)
                if (f.name != "description" && f.name != "title" && !config.hasOwnProperty(f,name)){
                    metadataFieldSet.remove(f);
                } else {
                    existingFields.push(f.name);
                }
            }
        );
        for (var p in config) {
          if (config.hasOwnProperty(p) 
                  && config[p] == "on" 
                      && !Ext.Array.contains(existingFields,p)){
                // TODO if we are on multi-form  add fieldcontainer with checkbox
                var fld = Ext.create('Ext.form.field.Text',{
                    name: p,
                    labelAlign: 'top',
                    fieldLabel: Ext.util.Format.capitalize(p)
                });
                // add new field to first fieldset (metadata) in editor
                metadataFieldSet.add(fld);
          }
        }
        button.up('window').close();
    },
    cancelUpdateEditorFields: function(button) {
        button.up("window").close();
    }
});
