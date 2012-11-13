Ext.define('austese_uploader.view.ThumbnailPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.thumbnailpanel',
    requires: [
        'austese_uploader.view.ThumbnailView'
    ],
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'thumbnailview',
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Help'
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
                            iconCls: 'helpIcon',
                            itemId: 'helpButton',
                            tooltip: 'Help'
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
        this.down('thumbnailview').store.sort(field);
    },
    filter: function(field, newValue) {
        var dataview = this.down('thumbnailview'),
            store = dataview.store;
        store.suspendEvents();
        store.clearFilter();
        dataview.getSelectionModel().clearSelections();
        store.resumeEvents();
        store.filter([new Ext.util.Filter(
            {
                property: 'filename',
                anyMatch: true,
                value   : newValue
            }),
            new Ext.util.Filter({
                property: 'title',
                anyMatch: true,
                value: newValue
            })]
        );
    }
});