

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
                startParam: false,
                sortParam: false
            }
        }, cfg)]);
        me.on('beforeload', function(store, operation) {
            //adjust page because we count from 0 not 1
            operation.page = operation.page - 1;
            if (operation.sorters.length > 0){
                var sortField = operation.sorters[0].property;
                if (sortField != 'filename'){
                    sortField = 'metadata.' + sortField
                } 
                if (sortField == 'metadata.uploaddate'){
                    sortField = "uploadDate";
                }
                store.getProxy().extraParams.sort = sortField;
            }
            if (operation.filters.length > 0){
                var filterValue = Ext.ComponentQuery.query('#filterField')[0].value;
                store.getProxy().extraParams.query = filterValue;
            }
        });
    }
});