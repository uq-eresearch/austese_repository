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
                            itemId: 'rotateleft',
                            iconCls: 'rotateLeft',
                            tooltip: 'Rotate selected images 90 degrees counter-clockwise'
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
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
                                    text: 'Cancel'
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
                                    text: 'Cancel'
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
    }
});