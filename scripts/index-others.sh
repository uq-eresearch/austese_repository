#!/bin/bash

# A simple script that sends a bunch of POST requests to a locally running
# ElasticSearch server with included mongodb-river, telling it about
# locally available AustESE records to start indexing.
#
# WARNING: Starts by deleting your existing ElasticSearch Austese Index

read -p "Do you wish to delete your ElasticSearch 'austese' index? " yn
case $yn in
    [Yy]* ) curl -X DELETE localhost:9200/austese;;
    [Nn]* ) ;;
    * ) ;;
esac



for collection in artefacts agents versions events works
do
  echo Deleting $collection river: 
  curl -X DELETE localhost:9200/_river/$collection; echo

done

echo "Pausing 10 seconds while ElasticSearch catches up"
sleep 10

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
      "include_fields": ["metadata", "_deleted"]
    },
    "db": "test",
    "collection": "$collection",

    "script": "if (ctx.document._deleted) {ctx.deleted = true; }"
  },
  "index": {
    "name": "austese",
    "type": "$collection",
    "bulk": { "concurrent_requests": 1 }
  }
}
EOF

  echo Creating $collection River
  curl -XPUT "localhost:9200/_river/$collection/_meta" -d"$json_doc"
  echo
done
