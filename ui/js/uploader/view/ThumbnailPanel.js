Ext.define('austese_uploader.view.ThumbnailPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.thumbnailpanel',
    requires: [
        'austese_uploader.view.ThumbnailView',
        'austese_uploader.view.ResourceGrid',
        'austese_uploader.form.MultiFileFieldButton',
        'austese_uploader.view.PagingToolbarResizer'
    ],
    layout: 'card',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'thumbnailview'
                },
                {
                    xtype: 'resourcegrid'
                }
            ],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: 'ResourceStore',
                    dock: 'bottom',
                    pageSize: 50,
                    displayInfo: true,
                    plugins : [new Ext.create('austese_uploader.view.PagingToolbarResizer',{
                            displayText: 'Resources per page', 
                            options : [25, 50, 75, 100, 150, 200, 500]
                    })]
                },
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        
                            {xtype:'form',
                                layout:'hbox',
                                bodyPadding:2,
                                bodyBorder: false,
                                
                                items:[
                                    {
                                        xtype:'multifilefieldbutton',
                                        iconCls: 'addIcon',
                                        itemId: 'addButton'
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'New',
                                        iconCls: 'newIcon',
                                        itemId: 'newButton',
                                        tooltip: 'Create new (empty) transcription'
                                    },
                                    {
                                        xtype:'button',
                                        text: 'Delete',
                                        iconCls: 'deleteIcon',
                                        itemId: 'deleteButton',
                                        margin:{
                                             left:2
                                        },
                                        tooltip: 'Delete selected resource(s)'
                                    }
                            ]
                            },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype:'buttongroup',
                            columns: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    itemId: 'thumbnailsButton',
                                    iconCls: 'thumbnailsIcon',
                                    toggleGroup: 'resourceViewType',
                                    pressed: true,
                                    tooltip: 'View as thumbnails'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'gridButton',
                                    iconCls: 'gridIcon',
                                    toggleGroup: 'resourceViewType',
                                    tooltip: 'View as list'
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Filter',
                            labelWidth: 35,
                            width: 140,
                            itemId: 'filterField',
                            labelAlign: 'right',
                            listeners: {
                                scope : this,
                                buffer: 50,
                                change: this.filter
                            }
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Sort By',
                            labelWidth: 45,
                            width: 155,
                            labelAlign: 'right',
                            store: 'SortByStore',
                            valueField: 'field',
                            displayField: 'label',
                            editable: false,
                            listeners: {
                                scope: this,
                                select: this.sort
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'homeIcon',
                            itemId: 'homeButton',
                            tooltip: 'Return to AustESE workbench home'
                        },
                        {
                            xtype: 'button',
                            iconCls: 'fullscreenIcon',
                            itemId: 'toggleFullscreenButton',
                            tooltip: 'Toggle fullscreen mode'
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    },
    sort: function() {
        var field = this.down('combobox').getValue();
        var store = Ext.getStore('ResourceStore');
        if (field == "uploaddate"){
            store.sort(field,'DESC');
        } else {
            store.sort(field,'ASC');
        }
        store.load();
    },
    filter: function(field, newValue) {
       var dataview = this.down('thumbnailview'),
            store = dataview.store;
        store.suspendEvents();
        store.clearFilter();
        dataview.getSelectionModel().clearSelections();
        store.resumeEvents();
        // FILTER function matches on title or filename
        store.filter({
            filterFn: function(item) {
                var re = newValue? new RegExp(newValue,'i'): '';
                return item.get('title').match(re) 
                    || item.get('filename').match(re);
            }
        });
        store.loadPage(1);
    }
});