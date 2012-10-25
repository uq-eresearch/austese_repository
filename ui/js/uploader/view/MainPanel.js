/**
 * @class austese_uploader.view.MainPanel
 * @extends Ext.panel.Panel
 */
Ext.define('austese_uploader.view.MainPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mainpanel',

    requires: [
        'austese_uploader.view.PropertiesPanel',
        'austese_uploader.view.ThumbnailPanel'
    ],
    autoWidth: true,
    height: 550,
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
            ]
        });

        me.callParent(arguments);
    }

});