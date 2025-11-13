@crypto-search @regression
Feature: Crypto Search and Filter Validation

  As a crypto reviewer
  In order to ensure data accuracy
  I need to verify search functionality and results consistency

  Background:
    Given the user is authenticated and logged in
    And the user has navigated to the Crypto Reviewer page
    And the user has selected "View Crypto data"

  @search-by-jurisdiction
  Scenario: User can search and filter crypto data by selected jurisdiction
    When the user selects "Azerbaijan" from the jurisdiction filter
    And the user clicks the Search button
    Then the search should complete successfully
    And the results should be filtered by "Azerbaijan"
    And the results should be displayed in a table format

  @search-results-consistency
  Scenario: Search results display consistent jurisdiction information
    When the user performs a search with "Azerbaijan" jurisdiction
    Then the results table should load
    And all result rows should contain "Azerbaijan" in the jurisdiction column
    And the results should be relevant to the selected filters

  @search-button-state
  Scenario: Search button becomes enabled when filters are selected
    When the user opens the search filters panel
    And the user has not selected any filters
    Then the Search button should be disabled
    When the user selects a jurisdiction
    And the user selects other required filters
    Then the Search button should become enabled
    And the user can click to perform search
