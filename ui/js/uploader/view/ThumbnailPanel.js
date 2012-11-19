Ext.define('austese_uploader.view.ThumbnailPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.thumbnailpanel',
    requires: [
        'austese_uploader.view.ThumbnailView',
        'austese_uploader.view.ResourceGrid',
        'austese_uploader.form.MultiFileFieldButton'
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
                    //html: 'grid'
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype:'buttongroup',
                            columns: 2,
                            items: [
                                {
                                    xtype:'multifilefieldbutton',
                                    iconCls: 'addIcon',
                                    itemId: 'addButton',
                                    tooltip: 'Upload additional resources'
                                },
                                {
                                    xtype:'button',
                                    iconCls: 'deleteIcon',
                                    itemId: 'deleteButton',
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
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Filter',
                            labelWidth: 45,
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
        Ext.getStore('ResourceStore').sort(field);
        //this.down('thumbnailview').store.sort(field);
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
    }
});