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
            // constants to refer to active views
            NONESELECTED: 0,
            EDITSINGLE: 1,
            EDITMULTI: 2,
            VIEWONLY: 3,
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
                {html:"<p class='muted' style='margin:auto;padding:1em'>Select one or more resources to view or edit resource metadata or to enable the 'Send To' menu.</p>"
                    + "<p class='muted' style='margin:auto;padding:1em'>To select multiple resources, use the mouse to drag around a group of resources, or hold down the shift key or command/control when clicking on resources.</p>"},
                // single resource property editor
                {
                    xtype: 'form',
                    bodyPadding: 10,
                    autoScroll: true,
                    trackResetOnLoad: true,
                    defaults: {
                        anchor:'100%',
                        labelAlign: 'top',
                        xtype: 'textfield'
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
                        },
                        {
                            xtype: 'textfield',
                            name: 'shortname',
                            fieldLabel: 'Short name'
                        },
                        {
                            xtype: 'textfield',
                            name: 'project',
                            fieldLabel: 'Project'
                        },
                        {
                            name: 'coverage',
                            fieldLabel: 'Coverage',
                        },
                        {
                            name: 'format',
                            fieldLabel: 'Format'
                        },
                        {
                            name: 'language',
                            fieldLabel: 'Language'
                        },
                        {
                            name: 'publisher',
                            fieldLabel: 'Publisher'
                        },
                        {
                            name: 'rights',
                            fieldLabel: 'Rights'
                        },
                        {
                            name: 'source',
                            fieldLabel: 'Source'
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'bottom',
                            items: [
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Save',
                                    tooltip: 'Update stored information for this resource'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Cancel'
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
                        },
                        {
                            xtype: 'fieldcontainer',
                            hideLabel: true,
                            itemId: 'projectfc',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    flex: 0,
                                    margins: '0 10 0 0',
                                    name: 'updateproject',
                                    fieldLabel: 'Label',
                                    hideLabel: true,
                                    boxLabel: ''
                                },
                                {
                                    xtype: 'textfield',
                                    flex: 1,
                                    name: 'project',
                                    fieldLabel: 'Project',
                                    labelAlign: 'top'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            hideLabel: true,
                            itemId: 'coveragefc',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    flex: 0,
                                    margins: '0 10 0 0',
                                    name: 'updatecoverage',
                                    fieldLabel: 'Label',
                                    hideLabel: true,
                                    boxLabel: ''
                                },
                                {
                                    xtype: 'textfield',
                                    flex: 1,
                                    name: 'coverage',
                                    fieldLabel: 'Coverage',
                                    labelAlign: 'top'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            hideLabel: true,
                            itemId: 'formatfc',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    flex: 0,
                                    margins: '0 10 0 0',
                                    name: 'updateformat',
                                    fieldLabel: 'Label',
                                    hideLabel: true,
                                    boxLabel: ''
                                },
                                {
                                    xtype: 'textfield',
                                    flex: 1,
                                    name: 'format',
                                    fieldLabel: 'Format',
                                    labelAlign: 'top'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            hideLabel: true,
                            itemId: 'languagefc',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    flex: 0,
                                    margins: '0 10 0 0',
                                    name: 'updatelanguage',
                                    fieldLabel: 'Label',
                                    hideLabel: true,
                                    boxLabel: ''
                                },
                                {
                                    xtype: 'textfield',
                                    flex: 1,
                                    name: 'language',
                                    fieldLabel: 'Language',
                                    labelAlign: 'top'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            hideLabel: true,
                            itemId: 'publisherfc',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    flex: 0,
                                    margins: '0 10 0 0',
                                    name: 'updatepublisher',
                                    fieldLabel: 'Label',
                                    hideLabel: true,
                                    boxLabel: ''
                                },
                                {
                                    xtype: 'textfield',
                                    flex: 1,
                                    name: 'publisher',
                                    fieldLabel: 'Publisher',
                                    labelAlign: 'top'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            hideLabel: true,
                            itemId: 'rightsfc',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    flex: 0,
                                    margins: '0 10 0 0',
                                    name: 'updaterights',
                                    fieldLabel: 'Label',
                                    hideLabel: true,
                                    boxLabel: ''
                                },
                                {
                                    xtype: 'textfield',
                                    flex: 1,
                                    name: 'rights',
                                    fieldLabel: 'Rights',
                                    labelAlign: 'top'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            hideLabel: true,
                            itemId: 'sourcefc',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    flex: 0,
                                    margins: '0 10 0 0',
                                    name: 'updatesource',
                                    fieldLabel: 'Label',
                                    hideLabel: true,
                                    boxLabel: ''
                                },
                                {
                                    xtype: 'textfield',
                                    flex: 1,
                                    name: 'source',
                                    fieldLabel: 'Source',
                                    labelAlign: 'top'
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
                },
                // display only view for resources
                {
                    xtype: 'form',
                    bodyPadding: 10,
                    autoScroll: true,
                    trackResetOnLoad: true,
                    items: [
                    {
                        xtype: 'fieldset',
                        collapsible: true,
                        title: 'Metadata',
                        defaultType: 'displayfield',
                        defaults: {
                            anchor:'100%',
                            labelAlign: 'left',
                            fieldStyle: 'padding-top:4px;', 
                            xtype: 'displayfield',
                            labelWidth: 60, 
                            renderer: function(val){
                                if (!val){
                                    return "<span class='muted'>Not specified</span>";
                                } 
                                else {
                                    return Ext.util.Format.ellipsis(val,25);
                                }
                            }
                        },
                        items: [
                            {   
                                fieldLabel: 'Title',
                                name:'title'
                            },
                            {   
                                fieldLabel: 'Desc',
                                name:'description'
                            },
                            {   
                                fieldLabel: 'Name',
                                name:'shortname'
                            },
                            {   
                                fieldLabel: 'Project',
                                name:'project'
                            },
                            {
                                name: 'coverage',
                                fieldLabel: 'Coverage',
                            },
                            {
                                name: 'format',
                                fieldLabel: 'Format'
                            },
                            {
                                name: 'language',
                                fieldLabel: 'Lang'
                            },
                            {
                                name: 'publisher',
                                fieldLabel: 'Publisher'
                            },
                            {
                                name: 'rights',
                                fieldLabel: 'Rights'
                            },
                            {
                                name: 'source',
                                fieldLabel: 'Source'
                            },
                            ]
                        },
                        // file info
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
                    }],
                    dockedItems: [
                                  // Actions that apply to one or more resources
                                  {
                                      xtype: 'toolbar',
                                      dock: 'top',
                                      items: [
                                          
                                          {xtype:'tbfill'},
                                          {
                                              xtype: 'button',
                                              text: 'Edit',
                                              iconCls: 'editIcon',
                                              tooltip: 'Edit metadata for selected resource(s)'
                                          },
                                          {
                                              // actions that involve loading resource in another tool
                                              xtype: 'splitbutton',
                                              text: 'Send to',
                                              iconCls: 'sendToIcon',
                                              menu: new Ext.menu.Menu(),
                                              tooltip: 'Send selected resource(s) to...'
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