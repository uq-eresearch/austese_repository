<?php

/**
 * Helps with running a search against ElasticSearch
 *
 * Runs queries against the 'austese' ES index
 *
 * Filters out any records that have been deleted or
 * superceded, requests highlighting on all fields,
 * and returns results in the right format for use in a
 * drupal search_execute() method.
 * 
 * 
 * Example:
 *   $query = new AusteseElasticSearchQuery();
 *   $query->project = $project;
 *   $query->type = "artefacts";
 *   $results = $query->search($searchTerm);
 */
class AusteseElasticSearchQuery {
    private $index = 'austese';
    public $project = null;
    public $per_page = 10;
    public $searchFields = array();
    public $type;

    public function __construct() {
    
    }


    /**
     * Perform the search, calling out to elastic search and returning results
     * reading for processing and displaying by drupal.
     * 
     * @param  [type] $searchTerm [description]
     * @return [type]             [description]
     */
    public function search($searchTerm) {
        $page = pager_find_page();
        $offset = $this->per_page * $page;

        $client = new Elasticsearch\Client();
        $searchParams['index'] = $this->index;
        $searchParams['from'] = $offset;
        $searchParams['size'] = $this->per_page;
        $searchParams['body']['filter']['and'][]['term']['metadata.project'] = $this->project;
        $searchParams['body']['filter']['and'][]['missing']['field'] = "metadata._superseded";
        $searchParams['body']['filter']['and'][]['missing']['field'] = "metadata._deleted";
        $searchParams['body']['filter']['and'][]['missing']['field'] = "_deleted";
        $searchParams['body']['highlight']['fields']['*'] = array("number_of_fragments" => 3);
        $searchParams['body']['highlight']['encoder'] = 'html';
        if ($this->type) {
            $searchParams['type'] = $this->type;
        }
        if ($searchTerm) {
            $searchParams['body']['query']['bool']['must'][] = array('query_string' => array('query' => $searchTerm));
        }

        foreach($this->searchFields as $searchTerm => $searchValue){
            if ($searchTerm) {
                $searchParams['body']['query']['bool']['must'][] = array(
                    'match'=>array($searchTerm => strtolower($searchValue)));
            }
        }

        $queryResponse = $client->search($searchParams);

        if (isset($queryResponse['error'])) {
            watchdog('repositoryapi', $queryResponse['error'], NULL, WATCHDOG_ERROR);
            drupal_set_message($queryResponse['error'], 'error');
        }

        pager_default_initialize($queryResponse['hits']['total'], $this->per_page);

        $results = array();
        foreach($queryResponse['hits']['hits'] as $searchResult) {


            $results[] = $this->_formatResult($searchResult);
        }
        return $results;
    }

    /**
     * Format an individual search result, depending on it's metadata type.
     * 
     * @param  [type] $searchResult [description]
     * @return [type]               [description]
     */
    function _formatResult($searchResult) {
        $obj = $searchResult['_source'];
        $id = $obj['_id'];
        $type = $searchResult['_type'];
        $metadata = $obj['metadata'];
        $snippet = "";
        if (ISSET($metadata['description'])){
            $snippet = text_summary($metadata['description']);
        }
        foreach($searchResult['highlight'] as $highlight_field => $highlight_matches) {
          foreach($highlight_matches as $match) {
            $snippet .= $match . "</br>";
          }
        }

        $url = 'repository/'. $type . '/' . $id;

        $result = array(
              'link' => url($url, array('query' => array('project' => $this->project))),
              'type' => $type,
              'score' => $searchResult['_score'],
              'snippet' => $snippet
              // 'date' => $obj['updateDate']
          );

        switch ($type) {
          case 'transcriptions':
            $url = 'repository/resources/' . $metadata['_resourceid'];
            $result['link'] = url($url, array('query' => array('project' => $this->project)));
            $result['title'] = '(Transcription) ' . $obj['filename'];
            break;

          case 'events':
            $result['title'] = '(Event) ' . $metadata['name'];
            break;

          case 'agents':
            $result['title'] = '(Agent) ' . $metadata['lastName'] . ', ' . $metadata['firstName'];
            break;

          case 'artefacts':
            $result['title'] = '(Artefact) ' . $metadata['source'];
            break;

          case 'works':
            $result['title'] = '(Work) ' . $metadata['workTitle'] . ' ' . $metadata['name'];
            break;

          case 'versions':
            $result['title'] = '(Version) ' . $metadata['versionTitle'] . ' - ' . $metadata['name'];
            break;
        }
        return $result;
    }
}
