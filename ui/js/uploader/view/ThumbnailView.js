/**
 * @class austese_uploader.view.ThumbnailView
 * @extends Ext.view.View
 */
Ext.define('austese_uploader.view.ThumbnailView', {
    extend: 'Ext.view.View',
    alias: 'widget.thumbnailview',
    autoScroll: true,
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
            ],
            tpl: [
                  '<tpl for=".">',
                      '<div data-qtip="<p><tpl if="title"><b>{title}</b><br/></tpl><tpl if="name"><b>({name})</b><br/></tpl><i>{filename}</i></p><tpl if="description"><p>{description}</p></tpl><tpl if="rights"><p>Rights: {rights}</p></tpl><tpl if="source"><p>Source: {source}</p></tpl>" class="x-unselectable thumb-wrap">',
                          '<div class="thumb">',
                          '<img class="thumbnail" src="{thumbnailUri}?scale=true" />',
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
        if (data.filetype.match("image")){
            if (data.thumb) {
                return data.thumb;
            } else {
                return data.uri;
            }
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
            dateString: Ext.util.Format.date(data.uploaddate, "d/m/Y g:i a")
        });
        return data;
    }
});
