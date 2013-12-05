#!/bin/bash

#curl -X DELETE localhost:9200/_river/transcriptions
#curl -X DELETE localhost:9200/austese/transcriptions

# Create the index
curl -XPUT localhost:9200/austese/

#                    "file": {
#                        "term_vector": "with_positions_offsets",
#                        "store": "yes"
#                    },

# Create a mapping that allows highlighting of content
curl -XPUT "localhost:9200/austese/transcriptions/_mapping" -d'
{
    "transcriptions": {
        "_source": {
            "excludes": ["content"]
        },
        "properties": {
            "chunkSize": {
                "type": "long"
            },
            "content": {
                "type": "attachment",
                "path": "full",
                "fields": {
                    "title": {
                        "store": "yes"
                    },
                    "content": {
                        "type": "string",
                        "term_vector": "with_positions_offsets",
                        "store": "yes"
                    },
                    "author": {
                        "type": "string"
                    },
                    "keywords": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                    "date": {
                        "format": "dateOptionalTime",
                        "type": "date"
                    },
                    "content_type": {
                        "type": "string"
                    }
                }
            },
            "contentType": {
                "type": "string"
            },
            "damodamo": {
                "type": "string",
                "store": true
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
}
'

# Create the river itself and start indexing mongo content
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


    "script": "if (ctx.document._deleted || ctx.document._superseded) {ctx.deleted = true; }",
    "gridfs": "true"
  },
  "index": {
    "name": "austese",
    "type": "transcriptions"
  }
}'

    # "filter": "{\"_superseded\": {$exists:false}}",
