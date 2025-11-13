@crypto-tabs @regression
Feature: Crypto Data Tabs Navigation

  As a crypto reviewer
  In order to access different types of crypto information
  I need to navigate between Definitions, Contacts, and Status tabs

  Background:
    Given the user is authenticated and logged in
    And the user has searched for crypto data with "Azerbaijan" jurisdiction
    And the search results are displayed

  @definitions-tab
  Scenario: User can open Definitions tab and view term information
    When the user clicks on the Definitions tab
    Then the Definitions tab should be active
    And the Term column header should be visible
    And the definitions table should load with data

  @contacts-tab
  Scenario: User can open Contacts tab and verify jurisdiction data
    When the user clicks on the Contacts tab
    Then the Contacts tab should be active
    And the user should see "Azerbaijan" in the contacts data
    And only the selected jurisdiction should be present on the Contacts page

  @status-tab
  Scenario: User can view Status tab with jurisdiction updates
    When the user clicks on the Status tab
    Then the Status tab should be active
    And the table should display the following columns:
      | Jurisdiction |
      | Date        |
      | Changes     |
    And the status table should contain data rows
