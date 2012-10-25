
Ext.Loader.setConfig({
    enabled: true
});

// necessary to map paths because we are running in a drupal module
Ext.Loader.setPath('austese_uploader.store', '/sites/all/modules/austese_repository/ui/js/uploader/store');
Ext.Loader.setPath('austese_uploader.model', '/sites/all/modules/austese_repository/ui/js/uploader/model');
Ext.Loader.setPath('austese_uploader.controller', '/sites/all/modules/austese_repository/ui/js/uploader/controller');
Ext.Loader.setPath('austese_uploader.view', '/sites/all/modules/austese_repository/ui/js/uploader/view');
Ext.Loader.setPath('Ext.ux', '/ext-4.1.1a/examples/ux');

Ext.application({
    models: [
        'ResourceModel'
    ],
    stores: [
        'ResourceStore',
        'SortByStore'
    ],
    views: [
        'MainPanel',
        'PropertiesPanel',
        'ThumbnailPanel',
        'ThumbnailView',
        'SelectPropertiesWindow'
    ],
    autoCreateViewport: false,
    name: 'austese_uploader',
    controllers: [
        'Controller'
    ], 
    launch: function(){
        Ext.create('austese_uploader.view.MainPanel', {
            renderTo: 'uploaderui'
        });
    }
});
