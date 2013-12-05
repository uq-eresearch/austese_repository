#!/bin/bash

curl -X DELETE localhost:9200/_river/transcriptions
curl -X DELETE localhost:9200/austese/transcriptions


curl -XPUT "localhost:9200/austese/transcriptions/_mapping" -d'
{
    "transcriptions": {
        "properties": {
            "chunkSize": {
                "type": "long"
            },
            "content": {
                "type": "attachment",
                "path": "full",
                "fields": {
                    "file" : {
                        "term_vector": "with_positions_offsets",
                        "store": "yes"
                    },
                    "content": {
                        "type": "string"
                    },
                    "author": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                    "date": {
                        "type": "date",
                        "format": "dateOptionalTime"
                    },
                    "keywords": {
                        "type": "string"
                    },
                    "content_type": {
                        "type": "string"
                    },
                    "content_length": {
                        "type": "integer"
                    }
                }
            },
            "contentType": {
                "type": "string"
            },
            "filename": {
                "type": "string"
            },
            "length": {
                "type": "long"
            },
            "md5": {
                "type": "string"
            },
            "metadata": {
                "properties": {
                    "_resourceid": {
                        "type": "string"
                    },
                    "_superseded": {
                        "type": "boolean"
                    },
                    "description": {
                        "type": "string"
                    },
                    "filetype": {
                        "type": "string"
                    },
                    "format": {
                        "type": "string"
                    },
                    "project": {
                        "type": "string"
                    },
                    "publisher": {
                        "type": "string"
                    },
                    "rights": {
                        "type": "string"
                    },
                    "shortname": {
                        "type": "string"
                    },
                    "source": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "updated": {
                        "type": "string"
                    }
                }
            },
            "uploadDate": {
                "type": "date",
                "format": "dateOptionalTime"
            }
        }
    }
}'

curl -XPUT "localhost:9200/_river/transcriptions/_meta" -d'
{
  "type": "mongodb",
  "mongodb": {
    "servers":
    [
      { "host": "127.0.0.1", "port": "27017" }
    ],
    "db": "test",
    "collection": "fs",

    "gridfs": "true"
  },
  "index": {
    "name": "austese",
    "type": "transcriptions"
  }
}'

    # "filter": "{\"_superseded\": {$exists:false}}",

    # "script": "if (ctx.document._deleted || ctx.document._superseded) {ctx.deleted = true; }"
