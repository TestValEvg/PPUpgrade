@crypto-status @regression @critical
Feature: Crypto Status View and Navigation

  As a crypto analyst
  In order to understand jurisdiction-specific status updates
  I need to view status information and navigate between result views

  Background:
    Given the user is authenticated and logged in
    And the user is on the Crypto Reviewer page
    And the user has opened the View Crypto Data section

  @status-single-jurisdiction
  Scenario: User views effective date message for single jurisdiction search
    When the user searches with a single jurisdiction "Azerbaijan"
    Then a message should display with effective date information
    And the message should contain "Results displayed are effective from"
    And the message should contain "please refer to Status view" link

  @status-multiple-jurisdictions
  Scenario: User gets status view redirect for multiple jurisdiction searches
    When the user searches with multiple jurisdictions "Azerbaijan" and "Bahrain"
    Then a message should display "Please refer to the Status view for information on updates."
    When the user clicks on the "Status view" link
    Then the user should be redirected to the Status tab
    And the Status page should be visible with all status data

  @status-table-structure
  Scenario: Status table displays required columns and data
    When the user navigates to the Status tab
    Then the table should have the following headers:
      | Column      |
      | Jurisdiction |
      | Date        |
      | Changes     |
    And each row should contain status information
    And the table should be properly formatted
