Feature: Petstore API - User Authentication and Authorization

  Scenario Outline: Login with different credential types
    Given the API endpoint "/auth/login"
    When I send a POST request with username "<username>" and password "<password>"
    Then the response code should be <status_code>
    And the response should contain "<expected_field>"

    Examples:
      | username | password | status_code | expected_field |
      | valid    | valid    | 200         | access_token   |
      | invalid  | valid    | 401         | error_message  |
      | valid    | invalid  | 401         | error_message  |

---

Feature: Petstore API - Pet Management CRUD Operations

  Background:
    Given the Petstore API is available
    And the base URL is "https://petstore.swagger.io/v2"

  Scenario: Get available pets successfully
    Given I want to retrieve pets with status "available"
    When I send a GET request to "/pet/findByStatus"
    Then the response code should be 200
    And the response should contain a list of pets
    And each pet should have required fields: id, name, status, photoUrls
    And all pets should have status "available"

  Scenario: Create a new pet successfully
    Given I have pet data:
      | field     | value                                    |
      | id        | 10001                                    |
      | name      | Test Dog                                 |
      | status    | available                                |
      | photoUrls | ["https://example.com/photo.jpg"]       |
    When I send a POST request to "/pet" with the pet data
    Then the response code should be 200
    And the response should contain the pet with name "Test Dog"
    And the response should contain the status "available"
    And the created pet ID should be stored for cleanup

  Scenario: Get pet by ID successfully
    Given a pet with ID 10001 exists
    When I send a GET request to "/pet/10001"
    Then the response code should be 200
    And the response should contain pet with ID 10001
    And the pet should have required fields

  Scenario: Update pet successfully
    Given a pet with ID 10001 exists with name "Test Dog"
    When I update the pet with new name "Updated Test Dog" and status "sold"
    And I send a PUT request to "/pet" with updated data
    Then the response code should be 200
    And the pet name should be "Updated Test Dog"
    And the pet status should be "sold"

  Scenario: Delete pet successfully
    Given a pet with ID 10001 exists
    When I send a DELETE request to "/pet/10001"
    Then the response code should be 200
    And the response should contain a deletion message
    And subsequent GET request to "/pet/10001" should return 404

  Scenario Outline: CRUD operations for different pet types
    Given I have a new "<pet_type>" with status "<status>"
    When I create the pet
    And I retrieve the pet
    And I update the pet status to "<new_status>"
    And I delete the pet
    Then all operations should complete successfully with 200 responses

    Examples:
      | pet_type | status    | new_status |
      | Dog      | available | sold       |
      | Cat      | pending   | available  |
      | Bird     | available | pending    |

---

Feature: Petstore API - Error Handling and Validation

  Background:
    Given the Petstore API is available

  Scenario: Get non-existent pet returns 404
    When I send a GET request to "/pet/99999999"
    Then the response code should be 404
    And the response should contain an error message

  Scenario: Create pet with missing required fields
    Given I have incomplete pet data without "photoUrls" and "status" fields
    When I send a POST request to "/pet" with the incomplete data
    Then the response code should be one of 400, 422, or 415
    Or the response code should be 200 with partial data

  Scenario: Invalid status parameter
    When I send a GET request to "/pet/findByStatus" with status "invalid_status"
    Then the response code should be 200
    And the response should return an empty array or error message

  Scenario Outline: Error responses for invalid inputs
    When I send a <method> request to "<endpoint>" with invalid <parameter>
    Then the response code should be <error_code>
    And the response should contain error information

    Examples:
      | method | endpoint | parameter   | error_code |
      | GET    | /pet/abc | ID          | 400        |
      | POST   | /pet     | JSON format | 400        |
      | PUT    | /pet     | data schema | 422        |

---

Feature: Petstore API - Boundary Value and Edge Cases

  Background:
    Given the Petstore API is available

  Scenario Outline: Create pet with boundary ID values
    Given I create a pet with ID "<pet_id>"
    When I send a POST request to "/pet"
    Then the response code should be 200
    Or the response code should be acceptable for boundary value
    And the pet should be created with ID "<pet_id>"

    Examples:
      | pet_id              |
      | 1                   |
      | 9223372036854775807 |
      | 0                   |

  Scenario Outline: Valid status values
    When I send a GET request to "/pet/findByStatus" with status "<status>"
    Then the response code should be 200
    And the response should be a list of pets
    And all pets should have status "<status>"

    Examples:
      | status    |
      | available |
      | pending   |
      | sold      |

  Scenario: Create pet with empty name
    Given I have pet data with empty name ""
    When I send a POST request to "/pet"
    Then the response should handle the empty name gracefully
    And the pet should be created successfully

---

Feature: Petstore API - Performance and Response Times

  Background:
    Given the Petstore API is available

  Scenario: GET operation responds within acceptable time
    When I send a GET request to "/pet/findByStatus"
    Then the response time should be less than 5000 milliseconds
    And the response code should be 200

  Scenario: POST operation responds within acceptable time
    Given I have valid pet data
    When I send a POST request to "/pet"
    Then the response time should be less than 3000 milliseconds
    And the response code should be 200

  Scenario: Multiple concurrent requests complete within time
    When I send 5 concurrent GET requests to "/pet/findByStatus"
    Then all responses should complete within 10000 milliseconds
    And all response codes should be 200

---

Feature: Petstore API - Data-Driven Testing

  Background:
    Given the Petstore API is available

  Scenario: Create multiple pets with different properties
    Given I have the following pets to create:
      | id    | name    | status    |
      | 20001 | Puppy   | available |
      | 20002 | Kitten  | sold      |
      | 20003 | Parrot  | pending   |
    When I create each pet
    Then each pet should be created successfully with 200 response
    And each pet should have the correct name and status

  Scenario: Query pets by different status values
    Given the following pet statuses exist:
      | status    |
      | available |
      | pending   |
      | sold      |
    When I query pets for each status
    Then I should get 200 responses for all queries
    And results should contain only pets with matching status

---

Feature: Petstore API - Complete Workflow Scenarios

  Background:
    Given the Petstore API is available
    And I have valid API credentials

  Scenario: Complete pet lifecycle from creation to deletion
    Given I have new pet data
    When I create the pet
    And I retrieve the created pet
    And I update the pet with new information
    And I retrieve the updated pet to verify changes
    And I delete the pet
    Then the pet should not exist in the system (404)

  Scenario: Multiple pets management workflow
    Given I want to manage multiple pets
    When I create 3 pets with different properties
    And I retrieve all available pets
    And I update one of the pets
    And I delete one of the pets
    Then I should have 2 pets remaining
    And the updated pet should reflect the changes
