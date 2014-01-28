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


curl -XPUT localhost:9200/austese/

for collection in artefacts agents versions events works
do
  echo Deleting $collection river: 
  curl -X DELETE localhost:9200/_river/$collection; echo

done

echo Updating analyzer settings
curl -XPOST 'localhost:9200/austese/_close'
curl -XPUT "localhost:9200/austese/_settings" -d'
{
    "analysis": { 
        "filter": {
            "remove_leading_article":{
              "type":"pattern_replace",
              "pattern": "(^a\/the |^a |^an |^the )",
              "replacement":" "
            },
            "ngram_filter": {
              "max_gram": 10,
              "min_gram": 1,
              "type": "nGram"
            }
        },
        "analyzer": { 
            "ngram_analyzer": {
                 "type": "custom",
                 "filter": ["standard","lowercase","asciifolding","ngram_filter"],
                 "tokenizer": "standard"
            },
            "sort_analyser": { 
                "type": "custom", 
                "tokenizer": "keyword", 
                "filter": ["lowercase", "remove_leading_article", "trim"],
                "char_filter" : [
                  "quotesetc"
               ]
            },
            "date_analyser": { 
                "type": "custom", 
                "tokenizer": "keyword", 
                "filter": ["lowercase", "trim"]
            },
            "sort_analyser_articles": {
                "type": "custom", 
                "tokenizer": "keyword", 
                "filter": ["lowercase", "trim"],
                "char_filter" : [
                  "quotesetc"
               ]
            } 
        },
       
        "char_filter" : {
            "quotesetc" : {
               "mappings" : [
                  "\\u0091=>\u0020",
                  "\\u0092=>\u0020",
                  "\\u2018=>\u0020",
                  "\\u2019=>\u0020",
                  "\\u0027=>\u0020",
                  "\\u0022=>\u0020",
                  "\\u002e=>\u0020",
                  "\\u2012=>\u0020",
                  "\\u2013=>\u0020",
                  "\\u2014=>\u0020"
               ],
               "type" : "mapping"
            }
         } 
    } 
}
'
curl -XPOST 'localhost:9200/austese/_open'
# Create mappings with sort fields
echo Updating works mappings
curl -XPUT "localhost:9200/austese/works/_mapping" -d'
{
    "works": {
        "properties": {
            "title": {"type":"string"},
            "metadata": {
                "properties": {
                    "workTitle": {
                       
                        "type": "multi_field",
                         "fields": {
                                "workTitle": {
                                    "type": "string",
                                    "analyzer": "ngram_analyzer",
                                    "index": "analyzed"
                                },
                                "_sort_workTitle": {
                                    "type":"string", 
                                    "index":"analyzed", 
                                    "analyzer":"sort_analyser"
                                }
                         }
                    },
                    "description": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                    "project": {
                        "type": "string"
                    },
                    "readingVersion": {
                        "type": "string"
                    },
                    "updated": {
                        "type": "string"
                    },
                    "versions": {
                        "type": "string"
                    }
                    
                }
            }
        }
    }
}
'
echo Updating artefacts mappings
curl -XPUT "localhost:9200/austese/artefacts/_mapping" -d'
{
  "artefacts" : {
    "properties" : {
      "artefacts" : {
        "type" : "string"
      },
      "metadata" : {
        "properties" : {
          "artefactSize" : {
            "type" : "string"
          },
          "artefacts" : {
            "type" : "string"
          },
          "bibDetails" : {
            "type" : "string"
          },
          "coverImage" : {
            "type" : "string"
          },
          "date" : {
            "type": "multi_field",
             "fields": {
                    "date": {
                        "type": "string",
                        "analyzer": "standard",
                        "index": "analyzed"
                    },
                    "_sort_date": {
                        "type":"string", 
                        "index":"analyzed", 
                        "analyzer":"date_analyser"
                    }
             }
          },
          "description" : {
            "type" : "string"
          },
          "facsimiles" : {
            "type" : "string"
          },
          "format" : {
            "type" : "string"
          },
          "generated" : {
            "type" : "string"
          },
          "importRowNumber" : {
            "type" : "string"
          },
          "pageNumbers" : {
            "type" : "string"
          },
          "paperType" : {
            "type" : "string"
          },
          "printer" : {
            "type" : "string"
          },
          "project" : {
            "type" : "string"
          },
          "publisher" : {
            "type" : "string"
          },
          "series" : {
            "type" : "string"
          },
          "source" : {
            "type": "multi_field",
             "fields": {
                    "source": {
                        "type": "string",
                        "analyzer": "ngram_analyzer",
                        "index": "analyzed"
                    },
                    "_sort_source": {
                        "type":"string", 
                        "index":"analyzed", 
                        "analyzer":"sort_analyser"
                    }
             }
          },
          "transcriptions" : {
            "type" : "string"
          },
          "updated" : {
            "type" : "string"
          }
        }
      }
    }
  }
}
'
echo Updating versions mappings
curl -XPUT "localhost:9200/austese/versions/_mapping" -d'
{
  "versions" : {
    "properties" : {
      "metadata" : {
        "properties" : {
          "artefacts" : {
            "type" : "string"
          },
          "date" : {
            "type": "multi_field",
             "fields": {
                    "date": {
                        "type": "string",
                        "analyzer": "standard",
                        "index": "analyzed"
                    },
                    "_sort_date": {
                        "type":"string", 
                        "index":"analyzed", 
                        "analyzer":"date_analyser"
                    }
             }
          },
          "description" : {
            "type" : "string"
          },
          "firstLine" : {
            "type": "multi_field",
             "fields": {
                    "firstLine": {
                        "type": "string",
                        "analyzer": "ngram_analyzer",
                        "index": "analyzed"
                    },
                    "_sort_firstLine": {
                        "type":"string", 
                        "index":"analyzed", 
                        "analyzer":"sort_analyser_articles"
                    }
             }
          },
          "illust" : {
            "type" : "string"
          },
          "importRowNumber" : {
            "type" : "string"
          },
          "lines" : {
            "type" : "string"
          },
          "name" : {
            "type" : "string",
            "type": "multi_field",
             "fields": {
                    "name": {
                        "type": "string",
                        "analyzer": "ngram_analyzer",
                        "index": "analyzed"
                    },
                    "_sort_name": {
                        "type":"string", 
                        "index":"analyzed", 
                        "analyzer":"sort_analyser"
                    }
             }
          },
          "project" : {
            "type" : "string"
          },
          "publisher" : {
            "type" : "string"
          },
          "transcriptions" : {
            "type" : "string"
          },
          "updated" : {
            "type" : "string"
          },
          "versionTitle" : {
            "type": "multi_field",
             "fields": {
                    "versionTitle": {
                        "type": "string",
                        "analyzer": "ngram_analyzer",
                        "index": "analyzed"
                    },
                    "_sort_versionTitle": {
                        "type":"string", 
                        "index":"analyzed", 
                        "analyzer":"sort_analyser"
                    }
             }
          },
          "versions" : {
            "type" : "string"
          }
        }
      }
    }
  }
}
'
echo Updating agents mappings
curl -XPUT "localhost:9200/austese/agents/_mapping" -d'
{
  "agents" : {
    "properties" : {
      "metadata" : {
        "properties" : {
          "agentType" : {
            "type" : "string"
          },
          "biography" : {
            "type" : "string"
          },
          "firstName" : {
            "type": "multi_field",
             "fields": {
                    "firstName": {
                        "type": "string",
                        "analyzer": "ngram_analyzer",
                        "index": "analyzed"
                    },
                    "_sort_firstName": {
                        "type":"string", 
                        "index":"analyzed", 
                        "analyzer":"sort_analyser_articles"
                    }
             }
          },
          "lastName" : {
             "type": "multi_field",
             "fields": {
                    "lastName": {
                        "type": "string",
                        "analyzer": "ngram_analyzer",
                        "index": "analyzed"
                    },
                    "_sort_lastName": {
                        "type":"string", 
                        "index":"analyzed", 
                        "analyzer":"sort_analyser_articles"
                    }
             }
          },
          "project" : {
            "type" : "string"
          },
          "updated" : {
            "type" : "string"
          }
        }
      }
    }
  }
}
'
echo Updating events mappings
curl -XPUT "localhost:9200/austese/events/_mapping" -d'
{
  "events" : {
    "properties" : {
      "metadata" : {
        "properties" : {
          "agents" : {
            "type" : "string"
          },
          "amanuenses" : {
            "type" : "string"
          },
          "artefacts" : {
            "type" : "string"
          },
          "authors" : {
            "type" : "string"
          },
          "description" : {
            "type": "multi_field",
             "fields": {
                    "description": {
                        "type": "string",
                        "analyzer": "ngram_analyzer",
                        "index": "analyzed"
                    },
                    "_sort_description": {
                        "type":"string", 
                        "index":"analyzed", 
                        "analyzer":"sort_analyser"
                    }
             }
          },
          "editors" : {
            "type" : "string"
          },
          "endDate" : {
            "type" : "string"
          },
          "eventType" : {
            "type" : "string"
          },
          "events" : {
            "type" : "string"
          },
          "eventtags" : {
            "type" : "string"
          },
          "influencers" : {
            "type" : "string"
          },
          "name" : {
            "type": "multi_field",
             "fields": {
                    "name": {
                        "type": "string",
                        "analyzer": "ngram_analyzer",
                        "index": "analyzed"
                    },
                    "_sort_name": {
                        "type":"string", 
                        "index":"analyzed", 
                        "analyzer":"sort_analyser"
                    }
             }
          },
          "places" : {
            "type" : "string"
          },
          "project" : {
            "type" : "string"
          },
          "publishers" : {
            "type" : "string"
          },
          "readers" : {
            "type" : "string"
          },
          "references" : {
            "type" : "string"
          },
          "startDate" : {
            "type": "multi_field",
             "fields": {
                    "startDate": {
                        "type": "string",
                        "analyzer": "standard",
                        "index": "analyzed"
                    },
                    "_sort_startDate": {
                        "type":"string", 
                        "index":"analyzed", 
                        "analyzer":"date_analyser"
                    }
             }
          },
          "updated" : {
            "type" : "string"
          }
        }
      }
    }
  }
}
'
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
      "exclude_fields": ["_revisions"]
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
