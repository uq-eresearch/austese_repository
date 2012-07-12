<?php
require 'vendor/slim/slim/Slim/Slim.php';
$config = require 'config.php';
$app = new Slim();

// TODO support authentication

// Create
function createRecord($collection){
  global $config;
  $env = Slim_Environment::getInstance();
  $input = $env['slim.input'];
  $response = Slim::getInstance()->response();
  try {
    $obj = parseJson($input);
    // check supplied data was valid
    if (count($obj)==0){
      $response->status(400);
      echo "Missing or invalid JSON data";
      return;
    }
    // add _deleted to the invalid list in case we want to support deleting specific revisions in future
    $invalidkeys = array("_deleted", "uri");
    foreach ($invalidkeys as $key) {
      if (array_key_exists($key,$obj)){
	$response->status(400);
	echo "JSON data for new object contains invalid field: $key";
	return;
      }
    }
    // Insert new object with one revision
    $newobj = array("_revisions" => array(1 => $obj));
    $m = new Mongo($config["dbhost"].":".$config["dbport"], array("persist" => "restapi"));
    $db = $m->selectDB($config["dbname"]);
    $coll = $db->selectCollection($collection);
    $inserted = $coll->insert($newobj, array("safe" => true));
    // check whether there were any errors during insert
    if ($inserted["ok"] != 1 || $inserted["err"] != NULL) {
      $response->status(500);
      echo $inserted["err"];
    }
    $response->status(201);
    // respond with the new object
    // insert passes newobj by reference, so new _id will have been added
    // use _id to generate uri
    $id = $newobj["_id"];
    $obj["uri"] = $config["uriprefix"] . $collection . "/" . $id->{'$id'};
    $response->header('Content-Type','application/json');
    echo json_encode($obj);
  } catch (Exception $e) {
    $response->status(500);    
    echo $e->getMessage();
  }
}
$app->post('/artefacts/', function () {
    createRecord("artefacts");
});
$app->post('/versions/',function(){
    createRecord("versions");
});
$app->post('/works/', function(){
    createRecord("works");
});
$app->post('/agents/', function(){
    createRecord("agents");
});

// Read
function getRecord($collection,$id,$revision) {
    global $config;
    $response = Slim::getInstance()->response();
    $m = new Mongo($config["dbhost"].":".$config["dbport"], array("persist" => "restapi"));
    $db = $m->selectDB($config["dbname"]);
    $coll = $db->selectCollection($collection);
    $query = array("_id"=>new MongoId($id));
    $obj = $coll->findOne($query);
    if (array_key_exists("_deleted",$obj)){
      $response->status(410);
      echo "The requested object has been deleted";
      return;
    }
    if ($obj == NULL){
      $response->status(404);
      return;
    }
    // lookup specified revision, or get latest
    $numrev = count($obj["_revisions"]);
    if ($revision == NULL || $revision > $numrev){
      $revision = $numrev;
    }
    $id = $obj["_id"];
    $returnobj = $obj["_revisions"][$revision];
    // generate uri
    $returnobj["uri"] = $config["uriprefix"] . $collection . "/" . $id->{'$id'};
    $response->header('Content-Type','application/json');
    echo json_encode($returnobj);
}
$app->get('/artefacts/:id(/:revision)', function ($id,$revision=NULL) use ($config) {
    getRecord("artefacts",$id,$revision);
});
$app->get('/versions/:id(/:revision)', function ($id,$revision=NULL) use ($config) {
    getRecord("versions",$id,$revision);
});
$app->get('/works/:id(/:revision)', function ($id,$revision=NULL) use ($config) {
    getRecord("works",$id,$revision);
});
$app->get('/agents/:id(/:revision)', function ($id,$revision=NULL) use ($config) {
    getRecord("agents",$id,$revision);
});

// Update
// TODO support patch for incremental update?
function updateRecord($collection,$id){
  global $config;
  $env = Slim_Environment::getInstance();
  $input = $env['slim.input'];
  $response = Slim::getInstance()->response();
  try {
    $obj = parseJson($input);
    // check supplied data was valid
    if (count($obj)==0){
      $response->status(400);
      echo "Missing or invalid JSON data";
      return;
    }
    // remove uri field as we generate this
    if (array_key_exists("uri", $obj)){
      unset($obj['uri']);
    }
    // TOD0 check for provenance fields, add date if required
    $m = new Mongo($config["dbhost"].":".$config["dbport"], array("persist" => "restapi"));
    $db = $m->selectDB($config["dbname"]);
    $coll = $db->selectCollection($collection);
    // lookup existing object to find revision number
    $id = new MongoId($id);
    $query = array("_id"=>$id);
    $existobj = $coll->findOne($query);
    $revindex = count($existobj["_revisions"]) + 1;
    // add revision, and if object was flagged as deleted, remove flag (this allows undeletion)
    $inserted = $coll->update(array("_id"=>$id), array('$set' => array('_revisions.'.$revindex => $obj), '$unset'=> array('_deleted'=>1)), array("safe" => true));
    // check whether there were any errors during update
    if ($inserted["ok"] != 1 || $inserted["err"] != NULL) {
      $response->status(500);
      echo $inserted["err"];
    }
    $response->status(204);
  } catch (Exception $e) {
    $response->status(500);    
    echo $e->getMessage();
  }

}
$app->put('/artefacts/:id', function ($id) use ($config) {
    updateRecord("artefacts",$id);
});
$app->put('/versions/:id', function ($id) use ($config) {
    updateRecord("versions",$id);
});
$app->put('/works/:id', function ($id) use ($config) {
    updateRecord("works",$id);
});
$app->put('/agents/:id', function ($id) use ($config) {
    updateRecord("agents",$id);
});
$app->put('/resources/:id',function($id) use ($config) {
    // update resource and metadata
    echo "not implemented";
});

// Delete
function deleteRecord($collection,$id){
  // add deleted flag to object (do not actually delete)
  // TODO: provide admin functions to completely remove deleted objects
  global $config;
  $response = Slim::getInstance()->response();
  try {
    $m = new Mongo($config["dbhost"].":".$config["dbport"], array("persist" => "restapi"));
    $db = $m->selectDB($config["dbname"]);
    $coll = $db->selectCollection($collection);
    $inserted = $coll->update(array("_id"=> new MongoId($id)),  array('$set' => array('_deleted' => true)), array("safe" => true));
    // check whether there were any errors during update
    if ($inserted["ok"] != 1 || $inserted["err"] != NULL) {
      $response->status(500);
      echo $inserted["err"];
    }
    $response->status(204);
  } catch (Exception $e){
    $response->status(500);    
    echo $e->getMessage();
  }
}
$app->delete('/artefacts/:id', function ($id) {
    deleteRecord("artefacts",$id);
});
$app->delete('/versions/:id', function ($id) {
    deleteRecord("versions",$id);
});
$app->delete('/works/:id', function ($id) {
    deleteRecord("works",$id);
});
$app->delete('/agents/:id', function ($id) {
    deleteRecord("agents",$id);
});

function parseJson($s) {
  // make sure keys are quoted
  $s = preg_replace('/(\w+):/i', '"\1":', $s);
  return json_decode($s, true);
}

$app->run();
?>