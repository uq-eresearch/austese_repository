Ext.define('austese_uploader.view.NewResourceWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.newresourcewindow',
    width: 350,
    id: 'newresourcewindow',
    title: 'Create new transcription',
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
                           text: 'Create a new transcription resource:'
                       },
                       
                       {
                           name: 'filename',
                           fieldLabel: 'File Name',
                           value: ''
                       },
                       {
                           xtype      : 'fieldcontainer',
                           fieldLabel : 'File Type',
                           defaultType: 'radiofield',
                           defaults: {
                               flex: 1
                           },
                           layout: 'hbox',
                           items: [
                               {
                                   boxLabel  : 'Plain text',
                                   name      : 'filetype',
                                   inputValue: 'text/plain',
                                   checked: true
                               }, {
                                   boxLabel  : 'TEI/XML',
                                   name      : 'filetype',
                                   inputValue: 'text/xml'
                                  
                               }
                           ]
                       },
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
                            text: 'Cancel'
                        },
                        {
                            xtype: 'button',
                            text: 'OK'
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
       
    }

});