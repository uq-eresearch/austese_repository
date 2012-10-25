Ext.define('austese_uploader.view.SelectPropertiesWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.selectpropertieswindow',

    width: 350,
    title: 'Select property fields to show in editor',

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
                            xtype: 'checkboxfield',
                            anchor: '100%',
                            name: 'coverage',
                            boxLabel: 'Coverage',
                        },
                        {
                            xtype: 'checkboxfield',
                            anchor: '100%',
                            name: 'format',
                            boxLabel: 'Format'
                        },
                        {
                            xtype: 'checkboxfield',
                            anchor: '100%',
                            name: 'language',
                            boxLabel: 'Language'
                        },
                        {
                            xtype: 'checkboxfield',
                            anchor: '100%',
                            name: 'publisher',
                            boxLabel: 'Publisher'
                        },
                        {
                            xtype: 'checkboxfield',
                            anchor: '100%',
                            name: 'rights',
                            boxLabel: 'Rights'
                        },
                        {
                            xtype: 'checkboxfield',
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
                            text: 'Cancel'
                        },
                        {
                            xtype: 'button',
                            text: 'Update'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});