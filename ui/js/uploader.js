jQuery(document).ready(function() {
    Ext.Loader.setConfig({
        enabled: true
    });
    
    var modulePath = '/' + jQuery('#metadata').data('modulepath');
    var project = jQuery('#metadata').data('project');
    // necessary to map paths because we are running in a drupal module
    Ext.Loader.setPath('austese_uploader.store', modulePath + '/ui/js/uploader/store');
    Ext.Loader.setPath('austese_uploader.model', modulePath + '/ui/js/uploader/model');
    Ext.Loader.setPath('austese_uploader.controller', modulePath + '/ui/js/uploader/controller');
    Ext.Loader.setPath('austese_uploader.view', modulePath + '/ui/js/uploader/view');
    Ext.Loader.setPath('austese_uploader.form', modulePath + '/ui/js/uploader/form');
    Ext.Loader.setPath('Ext.ux', '/sites/all/libraries/ext-4.1.1a/examples/ux');
    //keep z-index seed low to avoid interfering with drupal admin overlay
    Ext.WindowMgr.zseed = 1040;
    Ext.application({
        modulePath: modulePath,
        project: project,
        projectShortName: jQuery('#metadata').data('projectshortname'),
        enableCollation: jQuery('#metadata').data('enablecollation'),
        enableLightBox: jQuery('#metadata').data('enablelightbox'),
        enableAlignment: jQuery('#metadata').data('enablealignment'),
        models: [
            'ResourceModel'
        ],
        stores: [
            'ResourceStore',
            'SortByStore',
            'FilterStore'
        ],
        views: [
            'MainPanel',
            'PropertiesPanel',
            'ThumbnailPanel',
            'ThumbnailView',
            'ResourceGrid',
            'SelectPropertiesWindow',
            'SendToMVDWindow',
            'NewCollectionWindow'
        ],
        autoCreateViewport: false,
        name: 'austese_uploader',
        controllers: [
            'Controller'
        ], 
        launch: function(){
            var placeholder = Ext.get('uploaderui');
            Ext.getBody().setStyle('overflow', 'hidden');
            var mainWindow = Ext.create('austese_uploader.view.MainPanel',{
                    renderTo: Ext.getBody(),
            }).showAt(placeholder.getX(),placeholder.getY());
            var fullscreen = jQuery('#metadata').data('fullscreen');
            if (fullscreen == 1){
                this.getController('Controller').toggleFullscreen(Ext.ComponentQuery.query('#toggleFullscreenButton')[0]);
            }
            var organiserlist = jQuery('#metadata').data('organiserlist');
            if (organiserlist == 1){
                this.getController('Controller').toggleResourceView(Ext.ComponentQuery.query('#gridButton')[0]);
                Ext.ComponentQuery.query('#gridButton')[0].toggle(true);
                Ext.ComponentQuery.query('#thumbnailsButton')[0].toggle(false);
            }
            if (project){
                // set the project param for the store: used to filter resources belonging to project
                this.getStore('ResourceStore').proxy.extraParams.project = project;
            }
            this.getStore('ResourceStore').load();
            
        }
    });
});
