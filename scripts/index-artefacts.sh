curl -X DELETE localhost:9200/_river/artefacts
curl -X DELETE localhost:9200/austese
#curl -X DELETE localhost:9200/austese/artefacts


curl -XPUT "localhost:9200/_river/artefacts/_meta" -d'
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
    "collection": "artefacts",

    "script": "if (ctx.document._deleted) {ctx.deleted = true; }"
  },
  "index": {
    "name": "austese",
    "type": "artefacts"
  }
}'
