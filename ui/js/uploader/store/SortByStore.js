
Ext.define('austese_uploader.store.SortByStore', {
    extend: 'Ext.data.Store',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'SortByStore',
            data  : [{label: 'File Name', field: 'filename'},
                     {label: 'Upload Date', field: 'uploaddate'}, 
                     {label: 'Type', field: 'filetype'},
                     {label: 'Title', field: 'title'},
                     {label: 'Short Name', field: 'shortname'},
                     {label: 'Description', field: 'description'}
            ],
            fields: ['field', 'label'],
            proxy: {
                type: 'memory',
            }
        }, cfg)]);
    }
});