
var frisby = require('frisby');
var crypto = require('crypto');
var request = require('request');

var HOST = 'http://localhost';
var URL = HOST + '/sites/all/modules/austese_repository/api';

var types = ['work', 'version', 'artefact', 'agent', 'event', 'mvd'];
// Skipping Place

// STILL NEED TO DO RESOURCES

var mockData = {
    workTitle: 'title',
    name: 'name'
};

for (var i = 0; i < types.length; i++) {
    var type = types[i];
    describe("The " + type + " REST API", function() {
        it("can create, read, update and delete records", function() {
            frisby.create("Test creating " + type + " record")
                .post(URL + '/' + type + 's/', 
                      mockData,
                      {json: true}) // pass args as json, not form post
                .expectStatus(201)
                .expectHeader('Content-Type', 'application/json')
                .expectJSONTypes({
                    uri: String,
                    id: String
                })
                .expectJSON(mockData)
                .afterJSON(function (record) {


                    frisby.create("Test reading " + type + " record")
                        .get(HOST + record.uri)
                        .expectStatus(200)
                        .expectJSON({
                            name: 'name',
                            id: record.id,
                            uri: record.uri
                        })
                        .toss();

                    frisby.create("Test updating " + type + " record")
                        .put(HOST + record.uri, {
                            name: 'my name'
                        }, {json: true})
                        .expectStatus(204) // no content
                        .toss();




                    frisby.create("Test listing " + type + " records")
                        .get(URL + '/' + type + 's/')
                        .expectStatus(200)
                        .expectJSON('results.?', {
                            id: record.id,
                            uri: record.uri
                        })
                        .toss();


                    frisby.create("Test deleting " + type + " record")
                        .delete(HOST + record.uri)
                        .expectStatus(204)
                        .toss();
                })
                .toss();
        })
    })
}
// var record = { workTitle: 'title',
//   name: 'name',
//   versions: [],
//   uri: '/sites/all/modules/austese_repository/apiworks/51db6c7a73a4a1bd12000000',
//   id: '51db6c7a73a4a1bd12000000' };







describe("The API", function() {
    var testText = 'Some test text';
    var hash = crypto.createHash('md5').update(testText).digest("hex");

    it("can create a resource record containing file data", function() {
        runs(function() {
            this.r = request.put(URL + '/resources/');
            var form = r.form();
            form.append('testText.txt', new Buffer(testText, "utf8");)

        })
        waitsFor()
    })
})


fs.createReadStream('file.txt').pipe()

console.log(hash); // 9b74c9897bac770ffc029102a200c5de
