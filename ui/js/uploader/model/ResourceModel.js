Ext.define('austese_uploader.model.ResourceModel', {
    extend: 'Ext.data.Model',
    alias: 'model.resourcemodel',

    fields: [
        {
            name: 'uri'
        },
        {
            name: 'filename'
        },
        {
            name: 'filelength',
            mapping: 'length'
        },
        {
            name: 'uploaddate',
            dateFormat: 'timestamp',
            mapping: 'uploadDate.sec',
            type: 'date'
        },
        {
            name: 'coverage',
            mapping: 'metadata.coverage'
        },
        {
            name: 'description',
            mapping: 'metadata.description'
        },
        {
            name: 'format',
            mapping: 'metadata.format'
        },
        {
            name: 'language',
            mapping: 'metadata.language'
        },
        {
            name: 'publisher',
            mapping: 'metadata.publisher'
        },
        {
            name: 'rights',
            mapping: 'metadata.rights'
        },
        {
            name: 'source',
            mapping: 'metadata.source'
        },
        {
            name: 'title',
            mapping: 'metadata.title'
        },
        {
            name: 'type',
            mapping: 'metadata.filetype'
        }
    ]
});