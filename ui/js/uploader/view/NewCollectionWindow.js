Ext.define('austese_uploader.view.NewCollectionWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.newcollectionwindow',
    width: 350,
    id: 'newcollectionwindow',
    title: 'Create new collection',
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
                           text: 'Create a new collection containing ' + this.ids.length + ' resources:'
                       },
                       
                       {
                           name: 'name',
                           fieldLabel: 'Name',
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