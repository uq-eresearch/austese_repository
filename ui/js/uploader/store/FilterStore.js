
Ext.define('austese_uploader.store.FilterStore', {
    extend: 'Ext.data.Store',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'FilterStore',
            data  : [{filter: 'Empty'},
                     {filter: 'CCE'},
                     {filter: 'Novel'},
                     {filter: 'Play'},
                     {filter: 'Poem'}
            ],
            fields: ['filter'],
            proxy: {
                type: 'memory',
            }
        }, cfg)]);
    }
});