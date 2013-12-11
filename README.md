# austese_repository

Drupal 7 module providing search, display and editing UI and lightweight REST API wrapper around MongoDB for storing data for [AustESE](http://itee.uq.edu.au/~eresearch/projects/austese/) Content Repository.

How to use this module
* Ensure that MongoDB is running and that the configuration in api/config.php matches your setup
* Ensure that you have the Mongo PHP driver installed http://pecl.php.net/package/mongo
* Ensure that ExtJS 4.1.1a is installed in sites/all/libraries
* If you wish to take advantage of image scaling for thumbnails, ensure that PHP Imagick is installed (optional)
* Install this module to sites/all/modules/austese_repository
* Ensure that you have jQuery 1.8.x installed (e.g. using jQuery Update module)
* Enable module via drupal admin console

License: GPL 3.0


## Setting up ElasticSearch Indexing

| MongoDB River Plugin     | ElasticSearch    | MongoDB |
|--------------------------|------------------|---------|
| 1.7.2                    | 0.90.5           | 2.4.8   |

* Install MongoDB from 10gen to get latest version, [instructions here][0]
  * Uninstall Ubuntu Mongodb

            sudo apt-get remove mongodb mongodb-clients mongodb-dev mongodb-server

  * Install 10gen mongodb

            sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
            echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
            sudo apt-get update
            sudo apt-get install mongodb-10gen

* Install elasticsearch:
  * If on Ubuntu 13.10:

            sudo apt-get install elasticsearch

  * If on earlier Ubuntu:

            wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-0.90.7.deb
            sudo dpkg -i elasticsearch-0.90.7.deb

* Install elastic search mapper attachments

        sudo /usr/share/elasticsearch/bin/plugin -install elasticsearch/elasticsearch-mapper-attachments/1.9.0

* Install the mongodb river

        sudo /usr/share/elasticsearch/bin/plugin -install com.github.richardwilly98.elasticsearch/elasticsearch-river-mongodb/1.7.2 

* Install javascript scripting support for ElasticSearch

        sudo /usr/share/elasticsearch/bin/plugin -install elasticsearch/elasticsearch-lang-javascript/1.4.0

* Restart elasticsearch

        sudo service elasticsearch restart

* Convert MongoDB to running as a single master of a replica set, [Convert a Standalone to a Replica Set][1]
  * Edit `/etc/mongodb.conf` adding line:

            replSet = rs0

  * Restart `mongod`

            sudo service restart mongodb

  * Connect to the instance using the mongo shell and run:

            rs.initiate()


* Update MongoDB GridFS document structure, so that it can be accessed by the Java driver. Using the mongo shell:

        db.fs.files.update({}, {$rename: {'_resourceid': 'metadata._resourceid', '_superseded': 'metadata._superseded'}}, false, true)

        db.fs.files.find().forEach(function(doc) {
            db.fs.files.update({_id:doc._id}, {$set: {"contentType":doc.metadata.filetype}});
        });


* Enable the elasticsearch mongo river to start indexing:

        cd austese_repository
        ./scripts/index-others.sh


### Drupal Setup

* Update to `elasticsearch` branch of `austese_repository`
        
        git pull
        git checkout elasticsearch

* Install and enable drupal `composer_manager` module

        drush dl composer_manager
        drush en composer_manager
        cd sites/all/modules/composer_manager
        curl -sS https://getcomposer.org/installer | php 
        php composer.phar install

        drush composer-manager update

[0]: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
[1]: http://docs.mongodb.org/manual/tutorial/convert-standalone-to-replica-set/

## About

This module was developed as part of the [AustESE project](http://itee.uq.edu.au/~eresearch/projects/austese).


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/uq-eresearch/austese_repository/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

