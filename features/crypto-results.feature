@crypto-results @regression
Feature: Crypto Results Filtering and Display

  As a crypto analyst
  In order to review crypto assets by jurisdiction
  I need to filter and view crypto results

  Background:
    Given the user is authenticated and logged in
    And the user is on the Crypto Reviewer page
    And the user has opened the View Crypto Data section

  @filter-by-jurisdiction
  Scenario: User can view crypto results filtered by single jurisdiction
    When the user selects "Azerbaijan" as the jurisdiction
    And the user clicks the Search button
    Then the search results should display
    And the results should contain entries for "Azerbaijan"

  @expand-all-functionality
  Scenario: User can expand all results on Results and Definitions pages
    When the user selects "Azerbaijan" as the jurisdiction
    And the user clicks the Search button
    Then the Expand All button should be visible on the Results page
    When the user clicks the Expand All button
    Then the button text should change to "Collapse All"
    And all result items should be expanded
    When the user navigates to the Definitions tab
    Then the Expand All button should still be available
    And the user can click it to expand definitions
