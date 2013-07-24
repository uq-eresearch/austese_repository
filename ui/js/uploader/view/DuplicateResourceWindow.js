Ext.define('austese_uploader.view.DuplicateResourceWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.duperesourcewindow',
    width: 350,
    id: 'duperesourcewindow',
    title: 'Duplicate resource',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            modal: true,
            items: [
                {
                    xtype: 'form',
                    defaultType: 'textfield',
                    bodyPadding: 10,
                    items: [
                       
                       {
                           xtype: 'label',
                           text: 'Enter a file name for the new duplicate resource:'
                       },
                       
                       {
                           name: 'filename',
                           fieldLabel: 'File Name',
                           value: ''
                       }
                    ]
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        '->',
                        {
                            xtype: 'button',
                            text: 'OK'
                        },
                        {
                            xtype: 'button',
                            text: 'Cancel'
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
       
    }

});