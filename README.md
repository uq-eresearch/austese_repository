# AustESE Repository API
Lightweight REST API wrapper around MongoDB for storing data for [AustESE](http://itee.uq.edu.au/~eresearch/projects/austese/) Content Repository.


## Development
* Developed using the [Slim](http://www.slimframework.com/) framework
* We are using [Composer](http://getcomposer.org/) dependency manager. Install the required libraries by running the following commands from the project directory:

`curl -s http://getcomposer.org/installer | php`

`php composer.phar install`

* We are using [Behat](http://behat.org/) for testing. Run `bin/behat` from the project directory to run tests