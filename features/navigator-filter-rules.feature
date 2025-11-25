@navigator-filters @regression
Feature: Navigator Filter Validation Rules

  As a Navigator user
  In order to ensure valid searches
  I need the filter validation rules to be enforced correctly

  Background:
    Given the user is authenticated and logged in
    And the user is on the Navigator Compare Licensing page

  @search-button-disabled-empty
  Scenario: Search button is disabled when no filters are selected
    Given no filters have been selected
    Then the Search button should be disabled
    And the user should not be able to execute a search

  @search-button-requires-jurisdiction-and-service
  Scenario: Search button requires both Jurisdiction and Service selections
    When the user selects "Argentina" as the jurisdiction
    Then the Search button should still be disabled
    When the user selects "Banking" as the service
    Then the Search button should become enabled
    And the user should be able to execute the search

  @jurisdiction-filter-empty-initially
  Scenario: Jurisdiction filter starts with no selections
    Given the user views the Jurisdiction filter
    Then no jurisdictions should be selected
    And the filter dropdown should be available for selection

  @service-filter-empty-initially  
  Scenario: Service filter starts with no selections
    Given the user views the Service filter
    Then no services should be selected
    And the filter dropdown should be available for selection

  @other-filters-default-all
  Scenario: Other filters can use default "All" selection
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Banking" as the service
    And the user does not select any other filters
    Then the Search button should be enabled
    When the user clicks the Search button
    Then the search should execute successfully
    And results should be displayed with default values for unselected filters
