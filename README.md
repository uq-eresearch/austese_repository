# austese_repository

Drupal 7 module providing search, display and editing UI and lightweight REST API wrapper around MongoDB for storing data for [AustESE](http://itee.uq.edu.au/~eresearch/projects/austese/) Content Repository.

How to use this module
* Install to sites/all/modules/austese_repository
* Enable module via drupal admin console

License: GPL 3.0

## Development
* Developed using the [Slim](http://www.slimframework.com/) framework and ExtJS
* We are using [Composer](http://getcomposer.org/) dependency manager. Install the required libraries by running the following commands from the project directory:

`curl -s http://getcomposer.org/installer | php`

`php composer.phar install`

* We are using [Behat](http://behat.org/) for testing. Run `bin/behat` from the project directory to run tests