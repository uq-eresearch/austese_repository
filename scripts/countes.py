#!/usr/bin/env python

from elasticsearch import Elasticsearch

es = Elasticsearch()

types = ['artefacts', 'agents', 'versions', 'events', 'works']

print("Documents indexed by elastic search")
print("-----------------------------------")
for type in types:
    count = es.search(index="austese", doc_type=type)['hits']['total']
    print(type + ": " + str(count))

print

print("Non-deleted documents indexed by elastic search")
print("-----------------------------------")
for type in types:
    count = es.search(index="austese", doc_type=type, body={"filter":{"missing":{"field": "_deleted"}}})['hits']['total']
    print(type + ": " + str(count))
