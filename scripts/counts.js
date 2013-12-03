#!/usr/bin/env mongo

var types = ['artefacts', 'agents', 'versions', 'events', 'works'];

print("Non-deleted documents");
for (var i = 0; i < types.length; i++) {
    var count = db[types[i]].find({'_deleted':{$exists: false}}).count();
    print(types[i] + ": " + count);
}

print();

print("All documents");
for (var i = 0; i < types.length; i++) {
    var count = db[types[i]].count();
    print(types[i] + ": " + count);
}
