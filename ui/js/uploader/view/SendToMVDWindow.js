Ext.define('austese_uploader.view.SendToMVDWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.sendtomvdwindow',
    width: 350,
    title: 'Send to MVD',
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
                       /* {
                            xtype: 'label',
                            text: 'Select whether to add to existing MVD or create new'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'createoradd',
                            boxLabel: 'Create new MVD',
                            inputValue: 'new'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'createoradd',
                            boxLabel: 'Add to existing MVD',
                            inputValue: 'existing'
                        },
                        {
                            anchor: '100%',
                            name: 'docid',
                            fieldLabel: 'MVD Document'
                        },*/
                       {
                           xtype: 'label',
                           text: 'The following information will be used to create the MVD document identifier. These values should not contain spaces.It is recommended to provide at least those values indicated by *. If you specify values identical to those used by an existing MVD, the MVD will be overwritten.'
                       },
                       {
                           name: 'language',
                           fieldLabel: '*Language',
                           value: 'english'
                       },
                       {
                           name: 'author',
                           fieldLabel: '*Author',
                       },
                       {
                           name: 'work',
                           fieldLabel: '*Short Work Name'
                       },
                       {
                           name: 'section',
                           fieldLabel: 'Section'
                       },
                       {
                           name: 'subsection',
                           fieldLabel: 'Sub-section'
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