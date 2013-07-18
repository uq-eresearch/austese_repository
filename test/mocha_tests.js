

var request = require('supertest')
var chai = require('chai');
chai.should();
chai.use(require('chai-things'));
var crypto = require('crypto');

var HOST = 'http://localhost';
var URL = HOST + '/sites/all/modules/austese_repository/api';


describe('AustESE Content Repository', function() {

    describe("Resource API", function() {
        var testText = 'Some test text';
        var hash = crypto.createHash('md5').update(testText).digest("hex");
        var resourceUri;
        var resourceId;
        var resultsCount;

        it("can create a resource record containing file data", function(done) {

            var req = request(URL).post('/resources/');
            req.part()
              .set('Content-Type', 'text/plain')
              .set('Content-Disposition', 'form-data; name="data"; filename="testtext.txt"')
              .write(testText);

            req.expect(200)
              .end(function(err, res) {
                if(err) throw err;

                res.body.should.have.property('uri');
                res.body.should.have.property('id');
                res.body.should.have.property('length');
                res.body.filename.should.equal('testtext.txt');
                res.body.length.should.equal(14);
                resourceUri = res.body.uri;
                resourceId = res.body.id;

                done();
            });
        });

        it("can read the details about a created resource record", function(done) {
            request(HOST).get(resourceUri)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                res.body.should.have.property('md5');
                res.body.md5.should.equal(hash);
                res.body.should.have.property('uploadDate');
                res.body.should.have.property('id').that.equals(resourceId);
                res.body.should.have.property('filename');
                done();
            })
        });

        it("can return a list of all resources, including created resource", function(done) {
            request(URL).get('/resources/')
            .expect(200)
            .expect('Content-Type', 'application/json')
            .end(function(err, res) {
                if (err) throw err;
                res.body.should.have.property("count").that.is.a('number');
                res.body.should.have.property("results");
                res.body.results.should.be.an.instanceOf(Array);
                res.body.results.should.contain.an.item.with.property('id', resourceId);

                resultsCount = res.body.count;
                done();
            });
        });

        it("can delete a resource record", function(done) {
            request(HOST).del(resourceUri)
            .expect(204) // no content
            .end(done)
        });

        it("correctly states when a record has been deleted", function(done) {
            request(HOST).get(resourceUri)
            .expect(410) // deleted
            .end(done)
        });

        it("removes item from listing when deleted", function(done) {
            request(URL).get('/resources/')
            .expect(200)
            .expect('Content-Type', 'application/json')
            .end(function(err, res) {
                if (err) throw err;
                res.body.should.have.property("count");
                res.body.count.should.be.a('number');
                res.body.should.have.property("results");
                res.body.count.should.equal(resultsCount - 1);

                res.body.results.should.be.an.instanceOf(Array);
                res.body.results.should.not.contain.an.item.with.property('id', resourceId);

                done();
            });
        });
    });
    String.prototype.capitalise = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    var recordTypes = ['work', 'version', 'artefact', 'agent', 'event', 'mvd'];


    var mockData = {
        workTitle: 'title',
        name: 'test name'
    };

    for (var i = 0; i < recordTypes.length; i++) { (function() {
        var type = recordTypes[i];
        describe(type.capitalise() + " API", function() {
            var recordUri, recordId, resultsCount;
            it("can create a record", function(done) {
                request(URL).post('/' + type + 's/')
                .set('Content-Type', 'application/json')
                .send(mockData)

                .expect(201)
                .expect('Content-Type', 'application/json')
                .end(function(err, res) {
                    // console.log(res);
                    res.body.should.have.property('uri');
                    res.body.should.have.property('id');
                    recordUri = res.body.uri;
                    recordId = res.body.id;
                    done();
                });

            });

            it("can read a record", function(done) {
                var req = request(HOST);
                req.get(recordUri)
                .expect(200)
                .end(function(err, res) {
                    res.body.workTitle.should.equal(mockData.workTitle);
                    res.body.name.should.equal(mockData.name);
                    done();
                });
            });

            it("can update a record", function(done) {
                var req = request(HOST);
                req.put(recordUri)
                .send({name: 'my name'})
                .expect(204) // no content
                .end(done);
            });

            it("can read an updated record", function(done) {
                var req = request(HOST);
                req.get(recordUri)
                .expect(200)
                .end(function(err, res) {
                    res.body.should.not.have.property('workTitle');
                    res.body.name.should.equal('my name');
                    done();
                });
            });

            it("can return a list of all records, including created record", function(done) {
                request(URL).get('/' + type + 's/')
                .expect(200)
                .expect('Content-Type', 'application/json')
                .end(function(err, res) {
                    if (err) throw err;
                    res.body.should.have.property("count");
                    res.body.should.have.property("results");
                    res.body.results.should.be.an.instanceOf(Array);
                    res.body.results.should.contain.an.item.with.property('id', recordId);

                    resultsCount = res.body.count;
                    done();
                });
            });

            it("can delete a record", function(done) {
                var req = request(HOST);
                req.del(recordUri)
                .expect(204) // no content
                .end(done);
            });


            it("returns 'deleted' for a deleted record", function(done) {
                var req = request(HOST);
                req.get(recordUri)
                .expect(410) // deleted
                .end(done);
            });


            it("returns not found for a non existant record", function(done) {
                request(URL).get('/' + type + 's/nonexistantrecord')
                .expect(404) // does not exist
                .end(done);
            });

            it("removes record from listing when deleted", function(done) {
                request(URL).get('/' + type + 's/')
                .expect(200)
                .expect('Content-Type', 'application/json')
                .end(function(err, res) {
                    if (err) throw err;
                    res.body.should.have.property("count");
                    res.body.count.should.be.a('number');
                    res.body.should.have.property("results");
                    res.body.count.should.equal(resultsCount - 1);

                    res.body.results.should.be.an.instanceOf(Array);
                    res.body.results.should.not.contain.an.item.with.property('id', recordId);

                    done();
                });
            });
        });
    })();}

});


// Making resource thumbnails


// Listing resources

// by title
// by filetype
// by project

// check paging


// Retrieve resource content

// Update resource content




// Listing records



// check dates and revisions when creating and updating



// listing place featurecodes


