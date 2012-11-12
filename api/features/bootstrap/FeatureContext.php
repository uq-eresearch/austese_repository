<?php

use Behat\Behat\Context\ClosuredContextInterface,
    Behat\Behat\Context\TranslatedContextInterface,
    Behat\Behat\Context\BehatContext,
    Behat\Behat\Exception\PendingException;
use Behat\Gherkin\Node\PyStringNode,
    Behat\Gherkin\Node\TableNode;
use Symfony\Component\Yaml\Yaml;


/**
 * Features context.
 * 
 * Borrows some code from https://github.com/enygma/behat-fuel-rest by Chris Cornutt under an MIT license
 */
class FeatureContext extends BehatContext
{
  private $_restObject        = null;
  private $_restData          = null;
  private $_restObjectType    = null;
  private $_restObjectMethod  = 'get';
  private $_client            = null;
  private $_response          = null;
  private $_requestUrl        = null;

  private $_config= null;
  private $_configFile= 'behat.yml';

  /**
   * Initalize context
   */
    public function __construct(array $parameters)
    {
      $this->_restObject  = new stdClass();
      $this->_client      = new Guzzle\Service\Client();
      $this->_config = Yaml::parse($this->_configFile);
    }
    public function getParameter($name)
    {
      if ($this->_config !== null) {

	$parameters = $this->_config['default']['context']['parameters'];
	return (isset($parameters[$name])) ? $parameters[$name] : null;

      } else {
	throw new Exception('Configuration not loaded!');
      }
    }
    /**
     * @Given /^that I want to create a new "([^"]*)"$/
     */
    public function thatIWantToCreateANew($objectType)
    {
      $this->_restObjectType   = ucwords(strtolower($objectType));
      $this->_restObjectMethod = 'post';
    }

    /**
     * @Given /^I prepare to send this data:$/
     */
    public function iPrepareToSendThisData(PyStringNode $data)
    {
      $this->_restData = $data->getRaw();
    }

    /**
     * @When /^I request "([^"]*)"$/
     */
    public function iRequest($pageUrl)
    {
      $baseUrl = $this->getParameter('base_url');

      
      $this->_requestUrl = $baseUrl.$pageUrl;
      switch (strtoupper($this->_restObjectMethod)) {
      case 'GET':
                $response = $this->_client
		  ->get($this->_requestUrl)
		  //.'?'.http_build_str((array)$this->_restObject))
		  ->send();
                break;
      case 'POST':
	//$postFields = (array)$this->_restObject;
                $response = $this->_client
		  ->post($this->_requestUrl,null,null)
		  ->setBody($this->_restData)
		  ->send();
                break;
      case 'DELETE':
	$response = $this->_client
	  ->delete($this->_requestUrl)
	  //.'?'.http_build_str((array)$this->_restObject))
	  ->send();
	break;
      }
      $this->_response = $response;
    }
    /**
     * @Then /^the response is JSON$/
     */
    public function theResponseIsJson()
    {
      $data = json_decode($this->_response->getBody(true));

      if (empty($data)) {
	throw new Exception("Response was not JSON\n" . $this->_response);
      }
    }

      /**
       * @Given /^the response has a "([^"]*)" property henceforth known as "([^"]*)"$/
       */
      public function theResponseHasAPropertyHenceforthKnownAs($arg1, $arg2)
      {
        throw new PendingException();
      }

    /**
     * @Given /^the response "([^"]*)" property is the same as "([^"]*)"$/
     */
    public function theResponsePropertyIsTheSameAs($arg1, $arg2)
    {
      throw new PendingException();
    }


    /**
     * @Given /^the response has a "([^"]*)"$/
     */
    public function theResponseHasA($property)
    {
      $data = json_decode($this->_response->getBody(true));

      if (!empty($data)) {
	if (!isset($data->$property)) {
	  throw new Exception("Property '".$property."' is not set\n");
	}
      } else {
	throw new Exception("Response was not JSON\n" . $this->_response->getBody(true));
      }
    }

    /**
     * @Then /^the response status code should be (\d+)$/
     */
    public function theResponseStatusCodeShouldBe($httpStatus)
    {
      if ((string)$this->_response->getStatusCode() !== $httpStatus) {
        throw new Exception('HTTP code does not match '.$httpStatus.
			     ' (actual: '.$this->_response->getStatusCode().')');
      }
    }

}
