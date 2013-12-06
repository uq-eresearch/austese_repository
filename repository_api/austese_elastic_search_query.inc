<?php


class AusteseElasticSearchQuery {
    private $index = 'austese';
    public $project = null;
    public $per_page = 10;
    public $type;

    public function __construct() {
    
    }


    public function search($keys) {
        $page = pager_find_page();
        $offset = $this->per_page * $page;

        $client = new Elasticsearch\Client();
        $searchParams['index'] = $this->index;
        $searchParams['from'] = $offset;
        $searchParams['size'] = $this->per_page;
        $searchParams['body']['query']['query_string']['query'] = $keys;
        $searchParams['body']['filter']['and'][]['term']['metadata.project'] = $this->project;
        $searchParams['body']['filter']['and'][]['missing']['field'] = "metadata._superseded";
        $searchParams['body']['filter']['and'][]['missing']['field'] = "metadata._deleted";
        $searchParams['body']['filter']['and'][]['missing']['field'] = "_deleted";
        $searchParams['body']['highlight']['fields']['*'] = array("number_of_fragments" => 3);
        if ($this->type) {
            $searchParams['type'] = $this->type;
        }

        $queryResponse = $client->search($searchParams);

        pager_default_initialize($queryResponse['hits']['total'], $this->per_page);

        $results = array();
        foreach($queryResponse['hits']['hits'] as $searchResult) {


            $results[] = $this->_formatResult($searchResult);
        }
        return $results;
    }

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
              'snippet' => $snippet,
              'date' => $obj['updateDate']
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
            $result['extra'] = array($metadata['startDate'],$metadata['endDate']);
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
