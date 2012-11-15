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
      echo 'Missing or invalid JSON data';
      return;
    }
    // add _deleted to the invalid list in case we want to support deleting specific revisions in future
    $invalidkeys = array('_deleted', 'uri', 'id');
    foreach ($invalidkeys as $key) {
      if (array_key_exists($key,$obj)){
	$response->status(400);
	echo 'JSON data for new object contains invalid field: $key';
	return;
      }
    }
    // Insert new object with one revision
    $newobj = array('_revisions' => array($obj), 'metadata'=>array($obj));
    $m = new Mongo($config['dbhost'].':'.$config['dbport'], array('persist' => 'restapi'));
    $db = $m->selectDB($config['dbname']);
    $coll = $db->selectCollection($collection);
    $inserted = $coll->insert($newobj, array('safe' => true));
    // check whether there were any errors during insert
    if ($inserted['ok'] != 1 || $inserted['err'] != NULL) {
      $response->status(500);
      echo $inserted['err'];
    }
    $response->status(201);
    // respond with the new object
    // insert passes newobj by reference, so new _id will have been added
    // use _id to generate uri
    $id = $newobj['_id'];
    $obj['uri'] = $config['uriprefix'] . $collection . '/' . $id->{'$id'};
    $obj['id'] = $id->{'$id'};
    $response->header('Content-Type','application/json');
    echo json_encode($obj);
  } catch (Exception $e) {
    $response->status(500);    
    echo $e->getMessage();
  }
}
function makeThumbnail($srcpath,$destpath,$filetype) {
 $newWidth = 100;
 if($filetype=='image/jpeg'){
    $image = imagecreatefromjpeg($srcpath);
 } else {
    $image = imagecreatefrompng($srcpath);
 }
 $width = imagesx($image);
 $height = imagesy($image);
 $newHeight = floor($height * ($newWidth / $width));
 $virtImage = imagecreatetruecolor($newWidth, $newHeight);
 imagecopyresampled($virtImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
 if($filetype=='image/jpeg'){
  imagejpeg($virtImage,$destpath);
 } else {
  imagepng($virtImage,$destpath);
 }
}
function createResource(){
  global $config;
  try{
  $env = Slim_Environment::getInstance();
  $response = Slim::getInstance()->response();
  $m = new Mongo($config['dbhost'].':'.$config['dbport'], array('persist' => 'restapi'));
  $db = $m->selectDB($config['dbname']);
  $grid = $db->getGridFS();
  $filename=$_FILES["data"]["name"];
  $filetype=$_FILES["data"]["type"];
  $tmp = $_FILES["data"]["tmp_name"];
  if ($_FILES["data"]["error"]!=0){
    $response->status(500);    
    echo "Error uploading file";
  }
  
  // return metadata
  $storedfile = $grid->storeUpload('data',array('metadata' => array('filetype' => $filetype)));
  $id = $storedfile->{'$id'};
  $url = $config['uriprefix'] . '/resources/' . $id;
  $grid->update(array('_id'=> new MongoId($id)),
    array('$set' => array('thumb' => "/sites/default/files/thumbs/".$id)), array('safe' => true));
  $_ENV['id'] = $id;
  $_ENV['filetype'] = $filetype;
  //var_dump($storedfile);
  //return uri
  $query = array('_id'=>new MongoId($id));
  $file = $grid->findOne($query);
  echo "{\"uri\":\"". $url 
     ."\",\"thumb\":\"/sites/default/files/thumbs/".$id
     ."\",\"filename\":\"".$file->file['filename']
     ."\",\"length\":\"".$file->file['length']."\"}";
  
 } catch (Exception $e){
    $response->status(500);    
    echo $e->getMessage();
  }
}
$app->hook("slim.after",function() use ($app, $config){
 if (strpos($app->request()->getPathInfo(), "/resources") === 0 && $app->request()->isPost()) {
  // make thumbnail
  $id=$_ENV['id'];
  $filetype=$_ENV['filetype'];
  $url = $config['uriprefix'] . '/resources/' . $id;
  makeThumbnail('http://localhost'. $url,'../../../../default/files/thumbs/'.$id,$filetype);
 }
});
$app->post('/artefacts/', function () {
    createRecord('artefacts');
});
$app->post('/versions/',function(){
    createRecord('versions');
});
$app->post('/works/', function(){
    createRecord('works');
});
$app->post('/agents/', function(){
    createRecord('agents');
});
$app->post('/resources/', function(){
    createRecord('resources');
});
$app->post('/collections/',function(){
   createRecord('collections');
});
// Read list of records
$app->get('/artefacts/', function () {
    listRecords('artefacts','source');
});
$app->get('/versions/',function(){
    listRecords('versions','versionTitle');
});
$app->get('/works/', function(){
    listRecords('works','workTitle');
});
$app->get('/agents/', function(){
    listRecords('agents','name');
});
$app->get('/resources/',function(){
    listRecords('resources','filename');
});
$app->get('/collections/',function(){
    listRecords('collections','collectionTitle');
});
function listResources(){
  global $config;
  global $app;
  $response = Slim::getInstance()->response();
  $request = Slim::getInstance()->request();
  $m = new Mongo($config['dbhost'].':'.$config['dbport'], array('persist' => 'restapi'));
  $db = $m->selectDB($config['dbname']);
  $grid = $db->getGridFS();
  $pagesize = $request->get('pageSize');
  $pagenum = $request->get('pageIndex');
  // provide a default for page Index. Default for pagesize is null (all results will be returned)
  $pagenum = $pagenum? $pagenum : 0;
  $filterTerm = $request->get('q');
  $findopts = array('_deleted'=>array('$exists'=>false));
  if ($filterTerm != null){
      $regex = new MongoRegex("/".$filterTerm."/i");
      $findopts = array('$and'=>array($findopts,
				      array('metadata.filename'=>$regex)));
  }
  // sort by reverse id (newest objects should be listed first)
  $cursor = $grid->find($findopts)->sort(array('_id'=>-1))->limit($pagesize)->skip($pagenum * $pagesize);


  echo "{\"count\":\"" . $cursor->count(0) . "\", \"pageSize\": \"". $pagesize . "\", \"pageIndex\": \"". $pagenum . "\", \"results\": [";
  foreach ($cursor as $obj){
     try{
      $returnobj = $obj->file;
      $id = $returnobj['_id'];
      unset($returnobj['_id']);
      // generate uri
      $returnobj['uri'] = $config['uriprefix']  . '/resources/' . $id->{'$id'};
      $returnobj['id'] = $id->{'$id'};
      echo json_encode($returnobj);
      if ($cursor->hasNext()){
	echo ",\n";
      }
     } catch (Exception $e){
     }
    }
  
  echo "]}";
  $response->header('Content-Type','application/json');
}

function listRecords($collection, $labelField){
    global $config;
    global $app;
    $response = Slim::getInstance()->response();
    $request = Slim::getInstance()->request();
    $m = new Mongo($config['dbhost'].':'.$config['dbport'], array('persist' => 'restapi'));
    $db = $m->selectDB($config['dbname']);
    $coll = $db->selectCollection($collection);

    $pagesize = $request->get('pageSize');
    $pagenum = $request->get('pageIndex');
    // provide a default for page Index. Default for pagesize is null (all results will be returned)
    $pagenum = $pagenum? $pagenum : 0;
    // TODO: allow param to sort results by custom fields?
    // allow param to filter results
    $filterTerm = $request->get('q');
    $findopts = array('_deleted'=>array('$exists'=>false));
    if ($filterTerm != null){
      $regex = new MongoRegex("/".$filterTerm."/i");
      $findopts = array('$and'=>array($findopts,
				      array('metadata.'.$labelField=>
      				      $regex)));
    }
    // sort by reverse id (newest objects should be listed first)
    $cursor = $coll->find($findopts)->sort(array('_id'=>-1))->limit($pagesize)->skip($pagenum * $pagesize);

    // return metadata for results
    echo "{\"count\":\"" . $cursor->count(0) . "\", \"pageSize\": \"". $pagesize . "\", \"pageIndex\": \"" . $pagenum . "\", \"results\": [";
    
    foreach ($cursor as $obj){
     try{
      $numrev = count($obj['_revisions']) - 1;

      $id = $obj['_id'];
      $returnobj = $obj['_revisions'][$numrev];
      // generate uri
      $returnobj['uri'] = $config['uriprefix'] . $collection . '/' . $id->{'$id'};
      $returnobj['id'] = $id->{'$id'};
      echo json_encode($returnobj);
      if ($cursor->hasNext()){
	echo ",\n";
      }
     } catch (Exception $e){
     }
    }
    echo "]}";
    $response->header('Content-Type','application/json');
}

// Read single record
function getRecord($collection,$id,$revision) {
    global $config;
    $response = Slim::getInstance()->response();
    $m = new Mongo($config['dbhost'].':'.$config['dbport'], array('persist' => 'restapi'));
    $db = $m->selectDB($config['dbname']);
    $coll = $db->selectCollection($collection);
    $query = array('_id'=>new MongoId($id));
    $obj = $coll->findOne($query);
    if ($obj == NULL){
      $response->status(404);
      echo 'The requested object does not exist';
      return;
    }
    if (array_key_exists('_deleted',$obj)){
      $response->status(410);
      echo 'The requested object has been deleted';
      return;
    }
    // lookup specified revision, or get latest
    $numrev = count($obj['_revisions']) - 1;
    if ($revision == NULL || $revision > $numrev){
      $revision = $numrev;
    }
    $id = $obj['_id'];
    $returnobj = $obj['_revisions'][$revision];

    // generate uri
    $returnobj['uri'] = $config['uriprefix'] . $collection . '/' . $id->{'$id'};
    $returnobj['id'] = $id->{'$id'};
    $response->header('Content-Type','application/json');
    echo json_encode($returnobj);
}
function getResource($id, $revision){
  global $config;
  $response = Slim::getInstance()->response();
  $m = new Mongo($config['dbhost'].':'.$config['dbport'], array('persist' => 'restapi'));
  $db = $m->selectDB($config['dbname']);
  $grid = $db->getGridFS();
  $query = array('_id'=>new MongoId($id));
  $file = $grid->findOne($query);
  if ($file == null){
      $response->status(404);
      echo 'The requested resource does not exist';
      return;
  }
  if (array_key_exists('_deleted',$file->file)){
      $response->status(410);
      echo 'The requested resource has been deleted';
      return;
  }
  $filename = $file->file['filename'];
  try {
  $filetype = $file->file['metadata']['filetype'];
  $response->header('Content-type',$filetype);
  } catch (Exception $e){
  }
  $response->header('Content-Description','File Transfer');
  $response->header('Content-Disposition','attachment; filename='.$filename);

  echo $file->getBytes();

}
$app->get('/artefacts/:id(/:revision)', function ($id,$revision=NULL) use ($config) {
    getRecord('artefacts',$id,$revision);
});
$app->get('/versions/:id(/:revision)', function ($id,$revision=NULL) use ($config) {
    getRecord('versions',$id,$revision);
});
$app->get('/works/:id(/:revision)', function ($id,$revision=NULL) use ($config) {
    getRecord('works',$id,$revision);
});
$app->get('/agents/:id(/:revision)', function ($id,$revision=NULL) use ($config) {
    getRecord('agents',$id,$revision);
});
$app->get('/resources/:id(/:revision)', function ($id,$revision=NULL) use ($config) {
    getRecord('resources',$id,$revision);
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
      echo 'Missing or invalid JSON data';
      return;
    }
    // remove uri field as we generate this
    if (array_key_exists('uri', $obj)){
      unset($obj['uri']);
    }
    if (array_key_exists('id',$obj)){
      unset($obj['id']);
    }
    // TOD0 check for provenance fields, add date if required
    $m = new Mongo($config['dbhost'].':'.$config['dbport'], array('persist' => 'restapi'));
    $db = $m->selectDB($config['dbname']);
    $coll = $db->selectCollection($collection);
    // lookup existing object to find revision number
    $id = new MongoId($id);
    $query = array('_id'=>$id);
    $existobj = $coll->findOne($query);
    $revindex = count($existobj['_revisions']);
    // add revision, and if object was flagged as deleted, remove flag (this allows undeletion)
    $inserted = $coll->update(array('_id'=>$id), array('$set' => array('_revisions.'.$revindex => $obj, 'metadata'=>$obj), '$unset'=> array('_deleted'=>1)), array('safe' => true));
    // check whether there were any errors during update
    if ($inserted['ok'] != 1 || $inserted['err'] != NULL) {
      $response->status(500);
      echo $inserted['err'];
      return;
    }
    $response->status(204);
  } catch (Exception $e) {
    $response->status(500);    
    echo $e->getMessage();
  }
}
// this does not update the actual file stored, only the metadata for the resource
function updateResourceMetadata($id){
 global $config;
 $m = new Mongo($config['dbhost'].':'.$config['dbport'], array('persist' => 'restapi'));
 $db = $m->selectDB($config['dbname']);
 $grid = $db->getGridFS();
 $env = Slim_Environment::getInstance();
 $input = $env['slim.input'];
 $response = Slim::getInstance()->response();
 try {
  $obj = parseJson($input);
  // check supplied data was valid
  if (count($obj)==0){
   $response->status(400);
   echo 'Missing or invalid JSON data';
   return;
  }
  // remove uri field as we generate this
  if (array_key_exists('uri', $obj)){
   unset($obj['uri']);
  }
  if (array_key_exists('id',$obj)){
   unset($obj['id']);
  }
  // TODO: support revisions, undeletion
  $grid->update(array('_id'=> new MongoId($id)),
    array('$set' => array('metadata' => $obj)), array('safe' => true));
 } catch (Exception $e) {
    $response->status(500);    
    echo $e->getMessage();
  }
}
$app->put('/artefacts/:id', function ($id) use ($config) {
    updateRecord('artefacts',$id);
});
$app->put('/versions/:id', function ($id) use ($config) {
    updateRecord('versions',$id);
});
$app->put('/works/:id', function ($id) use ($config) {
    updateRecord('works',$id);
});
$app->put('/agents/:id', function ($id) use ($config) {
    updateRecord('agents',$id);
});
$app->put('/resources/:id',function($id) use ($config) {
    // update resource
    updateResourceMetadata($id);
});
$app->put('/collections/:id',function($id) use ($config) {
   updateRecord('collections',$id);
});

// Delete
function deleteRecord($collection,$id){
  // add _deleted flag to object (do not actually delete)
  // TODO: provide admin functions to completely remove deleted objects
  global $config;
  $response = Slim::getInstance()->response();
  try {
    $m = new Mongo($config['dbhost'].':'.$config['dbport'], array('persist' => 'restapi'));
    $db = $m->selectDB($config['dbname']);
    $coll = $db->selectCollection($collection);
    $inserted = $coll->update(array('_id'=> new MongoId($id)),  array('$set' => array('_deleted' => true)), array('safe' => true));
    // check whether there were any errors during update
    if ($inserted['ok'] != 1 || $inserted['err'] != NULL) {
      $response->status(500);
      echo $inserted['err'];
    }
    $response->status(204);
  } catch (Exception $e){
    $response->status(500);    
    echo $e->getMessage();
  }
}
function deleteResource($id){
  global $config;
  // add _deleted flag to resource (do not actually delete)
  $m = new Mongo($config['dbhost'].':'.$config['dbport'], array('persist' => 'restapi'));
  $db = $m->selectDB($config['dbname']);
  $grid = $db->getGridFS();
  
  $grid->update(array('_id'=> new MongoId($id)), array('$set' => array('_deleted' => true)), array('safe' => true));
}
$app->delete('/artefacts/:id', function ($id) {
    deleteRecord('artefacts',$id);
});
$app->delete('/versions/:id', function ($id) {
    deleteRecord('versions',$id);
});
$app->delete('/works/:id', function ($id) {
    deleteRecord('works',$id);
});
$app->delete('/agents/:id', function ($id) {
    deleteRecord('agents',$id);
});
$app->delete('/resources/:id', function ($id) {
    deleteResource($id);
});
$app->delete('/collection/:id',function($id) {
    deleteRecord('collections',$id);
});
function parseJson($s) {
  // make sure keys are quoted
  $s = preg_replace('/(\w+):/i', '"\1":', $s);
  return json_decode($s, true);
}

$app->run();
?>
