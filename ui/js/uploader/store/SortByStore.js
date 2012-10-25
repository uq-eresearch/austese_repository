
Ext.define('austese_uploader.store.SortByStore', {
    extend: 'Ext.data.Store',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'SortByStore',
            data  : [{label: 'Name', field: 'filename'}, 
                     {label: 'Date Uploaded', field: 'uploadDate'}, 
                     {label: 'Type', field: 'type'}, 
                     {label: 'Description', field: 'description'}
            ],
            fields: ['field', 'label'],
            proxy: {
                type: 'memory',
            }
        }, cfg)]);
    }
});