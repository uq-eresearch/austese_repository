Ext.define('austese_uploader.view.PropertiesPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.propertiespanel',

    width: 250,
    height: 'auto',
    layout: 'card',
    title: 'No resources selected',
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    hidden: true,
                    items: [
                        {
                            xtype: 'button',
                            text: 'Rotate',
                            itemId: 'rotateleft',
                            iconCls: 'rotateLeft',
                            tooltip: 'Rotate selected images 90 degrees counter-clockwise'
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
                            text: 'Rotate',
                            itemId: 'rotateright',
                            iconCls: 'rotateRight',
                            tooltip: 'Rotate selected images 90 degrees clockwise'
                        }
                    ]
                }
            ],
            items: [
                // blank card for when no property editor is to be displayed
                {html:"<p></p>"},
                // single resource property editor
                {
                    xtype: 'form',
                    bodyPadding: 10,
                    autoScroll: true,
                    trackResetOnLoad: true,
                    defaults: {
                    	anchor:'100%'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: true,
                            title: 'Resource metadata',
                            defaults: {
                                anchor: '100%',
                                labelAlign: 'top'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'title',
                                    fieldLabel: 'Title'
                                },
                                {
                                    xtype: 'textareafield',
                                    name: 'description',
                                    fieldLabel: 'Description'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            collapsible: true,
                            title: 'File information',
                            defaultType: 'displayfield',
                            defaults: {
                                labelAlign: 'top',
                                anchor: '100%'
                            },
                            items: [
                                {
                                    name: 'filename',
                                    fieldLabel: 'Original File Name'
                                    
                                },
                                {
                                    name: 'dateString',
                                    fieldLabel: 'Uploaded'
                                },
                                {
                                    name: 'sizeString',
                                    fieldLabel: 'Size'
                                },
                                {
                                    name: 'filetype',
                                    fieldLabel: 'Type'
                                }
                            ]
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'bottom',
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'configureIcon',
                                    itemId: 'configuresingle',
                                    tooltip: 'Select property fields to edit'
                                },
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Cancel',
                                    tooltip: 'Reset to most recently stored information',
                                    listeners: {
                                        scope: this,
                                        click: this.cancel
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: 'Save',
                                    tooltip: 'Update stored information for this resource'
                                }
                            ]
                        }
                    ]
                },
                // multi-resource property editor
                {
                    xtype: 'form',
                    bodyPadding: 10,
                    autoScroll: true,
                    trackResetOnLoad: true,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: true,
                            title: 'Resource metadata',
                            defaults: {
                            	layout: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    hideLabel: true,
                                    itemId: 'titlefc',
                                    items: [
                                        {
                                            xtype: 'checkboxfield',
                                            flex: 0,
                                            margins: '0 10 0 0',
                                            name: 'updatetitle',
                                            fieldLabel: 'Label',
                                            hideLabel: true,
                                            boxLabel: ''
                                        },
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            name: 'title',
                                            fieldLabel: 'Title',
                                            labelAlign: 'top'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    hideLabel: true,
                                    itemId: 'descriptionfc',
                                    items: [
                                        {
                                            xtype: 'checkboxfield',
                                            flex: 0,
                                            margins: '0 10 0 0',
                                            name: 'updatedescription',
                                            fieldLabel: 'Label',
                                            hideLabel: true,
                                            boxLabel: ''
                                        },
                                        {
                                            xtype: 'textareafield',
                                            flex: 1,
                                            name: 'description',
                                            fieldLabel: 'Description',
                                            labelAlign: 'top'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            collapsible: true,
                            title: 'File information',
                            defaultType: 'displayfield',
                            defaults: {
                                anchor:'100%',
                                labelAlign: 'top'
                            },
                            items: [
                                {
                                    name: 'dateString',
                                    fieldLabel: 'Uploaded'
                                },
                                {
                                    name: 'sizeString',
                                    fieldLabel: 'Size'
                                },
                                {
                                    name: 'filetype',
                                    fieldLabel: 'Type'
                                }
                            ]
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'bottom',
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'configureIcon',
                                    itemId: 'configuremulti',
                                    tooltip: 'Select property fields to edit'
                                },
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Cancel',
                                    tooltip: 'Reset to most recently stored information',
                                    listeners: {
                                        scope: this,
                                        click: this.cancel
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: 'Save',
                                    tooltip: 'Update stored information for all selected resources'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },
    loadRecords: function(records) {
        this.loadedRecords = records;
        var l = records.length;
        var s = l !== 1 ? 's' : '';
        if (l > 0){
            this.setTitle('Editing ' + l + ' resource' + s);
            this.down('toolbar').show();
        } else {
            this.setTitle('No resources selected');
            this.down('toolbar').hide();
        }
        var layout = this.getLayout();
        if (l == 1){
            // show single record editing UI
            layout.setActiveItem(1);
            layout.getActiveItem().getForm().loadRecord(records[0]);
        } else if (l > 0) {
            // show multi record editing UI - display values for upload date, size and type are aggregated
            layout.setActiveItem(2);
            var aggregatedValues = {
                    description: records[0].get('description'), 
                    title: records[0].get('title'),
                    type: ''
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
                aggregatedValues.type += t + " (" + aggregatedTypes[t] + ")<br/>";
            }
            layout.getActiveItem().getForm().setValues(aggregatedValues);
        } else {
            // show no resources card
            layout.setActiveItem(0);
        }
    },
    cancel: function(){
        this.getLayout().getActiveItem().getForm().reset();
    }
});