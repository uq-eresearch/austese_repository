/**
 * @class austese_uploader.view.ThumbnailView
 * @extends Ext.view.View
 */
Ext.define('austese_uploader.view.ThumbnailView', {
    extend: 'Ext.view.View',
    alias: 'widget.thumbnailview',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            multiSelect: true,
            trackOver: true,
            overItemCls: 'x-view-over',
            itemSelector: 'div.thumb-wrap',
            store: 'ResourceStore',
            emptyText: 'No resources to display',
            plugins: [
                Ext.create('Ext.ux.DataView.DragSelector', {}),
                //Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'filename'})
            ],
            tpl: [
                  '<tpl for=".">',
                      '<div class="thumb-wrap">',
                          '<div class="thumb">',
                          '<img class="thumbnail" src="{thumbnailUri}" title="{shortName}" />',
                          '</div>',
                          '<span class="x-editable">{shortName}</span>',
                      '</div>',
                  '</tpl>'
            ],
        });
        me.callParent(arguments);
        me.store.sort();
    },
    prepareThumbnail: function(data) {
        if (data.type.match("image")){
            return data.uri;
        } else {
            // FIXME: don't hardcode this URI
            return "/sites/all/modules/austese_repository/ui/img/texticon.png";
        }
    },
    prepareData: function(data) {
        Ext.apply(data, {
            thumbnailUri: this.prepareThumbnail(data),
            shortName: (data.title? Ext.util.Format.ellipsis(data.title, 15) : Ext.util.Format.ellipsis(data.filename,15)),
            sizeString: Ext.util.Format.fileSize(data.filelength),
            dateString: Ext.util.Format.date(data.uploadDate, "d/m/Y g:i a")
        });
        return data;
    }
});
