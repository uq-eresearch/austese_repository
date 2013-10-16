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
                           text: 'Creating MVD from '  + this.count + ' selected transcription' + (this.count!= 1?'s':'') +'.'
                       },
                       {
                           xtype: 'label',
                           text: ' The following information will be used to create the MVD document identifier. These values should not contain spaces.It is recommended to provide at least those values indicated by *. If you specify values identical to those used by an existing MVD, the MVD will be overwritten.'
                       },
                       {
                           name: 'project',
                           fieldLabel: '*Project',
                           value: (this.project? this.project : "default")
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
                       },
                       {
                           xtype: 'combobox',
                           name: 'filter',
                           fieldLabel: 'Filter',
                           store: 'FilterStore',
                           valueField: 'filter',
                           displayField: 'filter',
                           editable: false
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