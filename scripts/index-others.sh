#!/bin/sh

curl -X DELETE localhost:9200/austese

for collection in artefacts agents versions events works
do
read -d '' json_doc <<EOF
{
  "type": "mongodb",
  "mongodb": {
    "servers":
    [
      { "host": "127.0.0.1", "port": "27017" }
    ],
    "options": {
      "include_fields": ["metadata"]
    },
    "db": "test",
    "collection": "$collection",

    "script": "if (ctx.document._deleted) {ctx.deleted = true; }"
  },
  "index": {
    "name": "austese",
    "type": "$collection"
  }
}
EOF

echo Deleting $collection river: 
curl -X DELETE localhost:9200/_river/$collection
echo Deleting $collection index type
curl -X DELETE localhost:9200/austese/$collection
echo Creating $collection River
curl -XPUT "localhost:9200/_river/$collection/_meta" -d"$json_doc"
echo
done