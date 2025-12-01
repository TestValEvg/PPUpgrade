@navigator-general-visibility @regression
Feature: Navigator General Service Visibility Rules

  As a Navigator user
  In order to see relevant service categories only
  I need the General service to be suppressed ONLY when Banking, CF, or Lending are selected alone or in combination
  And General should appear when other services like Derivatives, Securities, or Funds are included

  Background:
    Given the user is authenticated and logged in
    And the user is on the Navigator Compare Licensing page
    And the user has navigated to the Licensing Restrictions section

  Business Rule: General service is suppressed when ONLY Banking, Corporate Finance, or Lending are selected
                 (any combination of these 3 services only)
                 General appears when any other service is added to the selection

  @show-general-with-banking-and-derivatives
  Scenario: General SHOULD be visible when Banking and Derivatives are selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Banking" as a service
    And the user selects "Derivatives & FX" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Banking" should appear as a service category heading
    And "Derivatives & FX" should appear as a service category heading
    And "General" SHOULD appear as a service category heading

  @suppress-general-with-banking-and-lending
  Scenario: General should NOT be visible when Banking and Lending are selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Banking" as a service
    And the user selects "Lending" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Banking" should appear as a service category heading
    And "Lending" should appear as a service category heading
    And "General" should NOT appear as a service category heading

  @suppress-general-with-banking-cf-lending
  Scenario: General should NOT be visible when Banking, Corporate Finance, and Lending are selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Banking" as a service
    And the user selects "Corporate Finance" as a service
    And the user selects "Lending" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Banking" should appear as a service category heading
    And "Corporate Finance" should appear as a service category heading
    And "Lending" should appear as a service category heading
    And "General" should NOT appear as a service category heading

  @show-general-with-all-services
  Scenario: General SHOULD be visible when all services are selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects all available services
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "General" SHOULD appear as a service category heading

  @suppress-general-with-banking-only
  Scenario: General should NOT be visible when only Banking is selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Banking" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Banking" should appear as a service category heading
    And "General" should NOT appear as a service category heading
    And no other service categories should be displayed

  @suppress-general-with-corporate-finance-only
  Scenario: General should NOT be visible when only Corporate Finance is selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Corporate Finance" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Corporate Finance" should appear as a service category heading
    And "General" should NOT appear as a service category heading
    And no other service categories should be displayed

  @suppress-general-with-lending-only
  Scenario: General should NOT be visible when only Lending is selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Lending" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Lending" should appear as a service category heading
    And "General" should NOT appear as a service category heading
    And no other service categories should be displayed

  @show-general-with-derivatives-fx-only
  Scenario: General SHOULD be visible when only Derivatives & FX is selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Derivatives & FX" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Derivatives & FX" should appear as a service category heading
    And "General" SHOULD appear as a service category heading
    And both service categories should be visible
