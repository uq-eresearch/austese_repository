/**
 * @class austese_uploader.view.ResourceGrid
 * @extends Ext.grid.Panel
 */
Ext.define('austese_uploader.view.ResourceGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.resourcegrid',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            multiSelect: true,
            store: Ext.getStore('ResourceStore'),
            columns: [
                  {text: 'File', dataIndex: 'filename', width:150},
                  {text: 'Title', dataIndex: 'title', flex: 1},
                  {text: 'Short Name', dataIndex: 'shortname'},
                  {text: 'Type', dataIndex: 'filetype'},
                  {text: 'Size', dataIndex: 'sizeString'},
                  {
                      text: 'Uploaded', 
                      dataIndex: 'uploaddate', 
                      renderer: Ext.util.Format.dateRenderer("d/m/Y g:i a")
                  },
                  {text: 'Coverage', dataIndex: 'coverage', hidden: true},
                  {text: 'Description', dataIndex: 'description', hidden: true},
                  {text: 'Format', dataIndex: 'format', hidden: true},
                  {text: 'Language', dataIndex: 'language', hidden: true},
                  {text: 'Publisher', dataIndex: 'publisher', hidden: true},
                  {text: 'Rights', dataIndex: 'rights', hidden: true},
                  {text: 'Source', dataIndex: 'source', hidden: true},
                  {text: 'Project', dataIndex: 'project', hidden: true}
            ]
        });
        me.callParent(arguments);
        me.store.sort();
    }
});
