/**
 * @class austese_uploader.view.MainPanel
 * @extends Ext.panel.Panel
 */
Ext.define('austese_uploader.view.MainPanel', {
    extend: 'Ext.window.Window',
    alias: 'widget.mainpanel',
    closable: false,
    height: 500,
    header:false,
    border:false,
    resizeHandles: '',
    shadow:false,
    width: 600,
    cls:'uploaderui',
    requires: [
        'austese_uploader.view.PropertiesPanel',
        'austese_uploader.view.ThumbnailPanel',
        'Ext.ux.statusbar.StatusBar'
    ],
    layout: {
        type: 'border'
    },
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    region: 'west',
                    width: 250,
                    layout: 'anchor',
                    resizable: true,
                    resizeHandles: 'e',
                    items: [
                        {
                            xtype: 'propertiespanel',
                            anchor: '100% 100%'
                        }
                    ]
                },
                {
                    xtype: 'thumbnailpanel',
                    region: 'center'
                }
            ],
            dockedItems: [{
                xtype:'statusbar',
                dock: 'bottom',
                id: 'statusbar',
                busyText: 'Updating...',
                defaultText: 'AustESE uploader',
                items: [
                      {
                          xtype: 'button',
                          iconCls: 'helpIcon',
                          itemId: 'helpButton',
                          tooltip: 'Help'
                      }
                ]
            }]
        });
        me.callParent(arguments);
    }

});