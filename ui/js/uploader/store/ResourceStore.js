

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
            model: 'austese_uploader.model.ResourceModel',
            proxy: {
                type: 'ajax',
                url: '/sites/all/modules/austese_repository/api/resources/',
                reader: {
                    type: 'json',
                    root: 'results'
                },
                extraParams: {
                    project: ''
                }
            }
        }, cfg)]);
    }
});