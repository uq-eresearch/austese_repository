Feature: Repository REST API

Scenario: Add artefact
    Given that I want to create a new "Artefact"
    And I prepare to send this data:
    """
    {
	"date":"1900",
    	"source":"Artefact1"
    }
    """
    When I request "artefacts/"
    Then the response is JSON
    And the response has a "uri" property henceforth known as "newuri"
    And the response status code should be 201

    When I request "uri"
    Then the response is JSON
    And the response "uri" property is the same as "newuri"
    And the response status code should be 200

Scenario: Update artefact

Scenario: Update artefact again

Scenario: Get specific revision of artefact

Scenario: Delete artefact

Scenario: Get deleted artefact

Scenario: Update deleted artefact



Scenario: Add version

Scenario: Add Work

Scenario: Add Agent

