Ext.define('austese_uploader.view.SelectPropertiesWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.selectpropertieswindow',

    width: 350,
    title: 'Select property fields to show in editor',
    id: 'selectpropertieswindow',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    defaultType: 'checkboxfield',
                    bodyPadding: 10,
                    items: [
                        {
                            anchor: '100%',
                            name: 'coverage',
                            boxLabel: 'Coverage',
                        },
                        {
                            anchor: '100%',
                            name: 'format',
                            boxLabel: 'Format'
                        },
                        {
                            anchor: '100%',
                            name: 'language',
                            boxLabel: 'Language'
                        },
                        {
                            anchor: '100%',
                            name: 'publisher',
                            boxLabel: 'Publisher'
                        },
                        {
                            anchor: '100%',
                            name: 'rights',
                            boxLabel: 'Rights'
                        },
                        {
                            anchor: '100%',
                            name: 'source',
                            boxLabel: 'Source'
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
                            text: 'Select All'
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
                            text: 'Update'
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
        
        // use existingFields config to set up initial checkbox values
        if (me.existingFields) {
            me.down('form').items.each(function(f){
                if (Ext.Array.contains(me.existingFields,f.name)){
                    f.setValue("on");
                }
            });
        }
    }

});