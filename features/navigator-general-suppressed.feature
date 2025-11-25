@navigator-general-suppressed @regression
Feature: Navigator General Service Suppression Rules

  As a Navigator user
  In order to see relevant service categories only
  I need the General service to be suppressed when specific services are selected

  Background:
    Given the user is authenticated and logged in
    And the user is on the Navigator Compare Licensing page
    And the user has navigated to the Licensing Restrictions section

  @suppress-general-with-banking-and-corporate-finance
  Scenario: General is suppressed when Banking and Corporate Finance are selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Banking" as a service
    And the user selects "Corporate Finance" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Banking" should appear as a service category heading
    And "Corporate Finance" should appear as a service category heading
    And "General" should NOT appear as a service category heading
    And no other service categories should be displayed

  @suppress-general-with-corporate-finance-only
  Scenario: General is suppressed when only Corporate Finance is selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Corporate Finance" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Corporate Finance" should appear as a service category heading
    And "General" should NOT appear as a service category heading
    And no other service categories should be displayed

  @show-general-with-derivatives-fx-only
  Scenario: General is NOT suppressed when only Derivatives & FX is selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Derivatives & FX" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Derivatives & FX" should appear as a service category heading
    And "General" SHOULD appear as a service category heading
    And both service categories should be visible
