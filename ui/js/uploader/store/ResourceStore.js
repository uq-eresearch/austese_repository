

Ext.define('austese_uploader.store.ResourceStore', {
    extend: 'Ext.data.Store',
    alias: 'store.resourcestore',

    requires: [
        'austese_uploader.model.ResourceModel'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        if (cfg.project){
            me.project = cfg.project;
        }
        me.callParent([Ext.apply({
            autoLoad: false,
            storeId: 'ResourceStore',
            pageSize: 50,
            model: 'austese_uploader.model.ResourceModel',
            proxy: {
                type: 'ajax',
                url: '/sites/all/modules/austese_repository/api/resources/',
                reader: {
                    type: 'json',
                    root: 'results',
                    totalProperty: 'count'
                },
                extraParams: {
                    project: ''
                },
                pageParam: 'pageIndex',
                limitParam: 'pageSize',
                startParam: false
            }
        }, cfg)]);
        me.on('beforeload', function(store, operation) {
            //adjust page because we count from 0 not 1
            operation.page = operation.page - 1;
        });
    }
});