@navigator @comprehensive-filters @regression
Feature: Navigator Comprehensive Filter Rules

  As a Navigator user
  I need comprehensive filter validation and business rules
  So that I can effectively search and compare licensing restrictions across jurisdictions

  Background:
    Given the user is authenticated and logged in
    And the user is on the Navigator Compare Licensing page

  # ============================================================
  # Section 1: Filter Validation Rules
  # ============================================================

  @filter-validation @search-disabled
  Scenario: Search button remains disabled without required filter selections
    Given no filters have been selected
    Then the Search button should be disabled
    And the user should not be able to execute a search

  @filter-validation @jurisdiction-required
  Scenario: Search button requires at least one jurisdiction selection
    When the user selects "Banking" as the service
    But no jurisdiction is selected
    Then the Search button should remain disabled
    And an appropriate validation message should guide the user

  @filter-validation @service-required
  Scenario: Search button requires at least one service selection
    When the user selects "Argentina" as the jurisdiction
    But no service is selected
    Then the Search button should remain disabled
    And an appropriate validation message should guide the user

  @filter-validation @both-required
  Scenario: Search button enables only when both jurisdiction and service are selected
    Given no filters have been selected
    When the user selects "Argentina" as the jurisdiction
    Then the Search button should remain disabled
    When the user selects "Banking" as the service
    Then the Search button should become enabled
    And the user should be able to execute the search

  @filter-validation @multiple-jurisdictions
  Scenario: User can select multiple jurisdictions for comparison
    When the user selects the following jurisdictions:
      | Argentina |
      | Austria   |
      | Belgium   |
    And the user selects "Banking" as the service
    Then the Search button should be enabled
    When the user clicks the Search button
    Then results should be displayed for all 3 jurisdictions

  @filter-validation @jurisdiction-limit
  Scenario: System enforces maximum jurisdiction selection limit
    When the user attempts to select more than 5 jurisdictions
    Then the system should prevent additional selections
    And a message should inform the user of the 5 jurisdiction limit

  @filter-validation @multiple-services
  Scenario: User can select multiple services for comparison
    When the user selects "Argentina" as the jurisdiction
    And the user selects the following services:
      | Banking            |
      | Corporate Finance  |
      | Derivatives & FX   |
    Then the Search button should be enabled
    When the user clicks the Search button
    Then results should display all selected service categories

  # ============================================================
  # Section 2: Filter Initialization and Defaults
  # ============================================================

  @filter-defaults @initial-state
  Scenario: Filters initialize with empty selections
    Given the user views the Navigator filters
    Then no jurisdictions should be selected
    And no services should be selected
    And the Search button should be disabled

  @filter-defaults @jurisdiction-dropdown
  Scenario: Jurisdiction dropdown displays all available jurisdictions
    When the user opens the Jurisdiction filter dropdown
    Then the dropdown should display all available jurisdictions
    And the list should be searchable
    And jurisdictions should be sorted alphabetically

  @filter-defaults @service-dropdown
  Scenario: Service dropdown displays available service categories
    When the user opens the Service filter dropdown
    Then the dropdown should display the following services:
      | Banking           |
      | Corporate Finance |
      | Derivatives & FX  |
      | Lending           |
    And "General" should NOT appear in the Service dropdown
    And services should be displayed in a consistent order

  @filter-defaults @other-filters
  Scenario: Additional filters use "All" as default selection
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Banking" as the service
    And the user does not modify other filters
    Then other filters should default to "All"
    When the user clicks the Search button
    Then the search should execute with "All" values for unspecified filters

  # ============================================================
  # Section 3: General Service Suppression Rules (Work Item 108651)
  # 
  # IMPORTANT: When General service is suppressed, ALL associated activities
  # and subactivities under General are also suppressed from results.
  # This is a cascading suppression rule.
  # ============================================================

  @general-suppression @banking-suppresses
  Scenario: General is suppressed when Banking is selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Banking" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Banking" should appear as a service category heading
    And "General" should NOT appear as a service category heading
    And all activities and subactivities under "General" should also be suppressed

  @general-suppression @corporate-finance-suppresses
  Scenario: General is suppressed when Corporate Finance is selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Corporate Finance" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Corporate Finance" should appear as a service category heading
    And "General" should NOT appear as a service category heading
    And all activities and subactivities under "General" should also be suppressed

  @general-suppression @lending-suppresses
  Scenario: General is suppressed when Lending is selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Lending" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Lending" should appear as a service category heading
    And "General" should NOT appear as a service category heading
    And all activities and subactivities under "General" should also be suppressed

  @general-suppression @multiple-suppressors
  Scenario: General is suppressed when multiple suppressing services are selected
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
    And all activities and subactivities under "General" should also be suppressed

  @general-suppression @derivatives-shows-general
  Scenario: General is NOT suppressed when only Derivatives & FX is selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Derivatives & FX" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Derivatives & FX" should appear as a service category heading
    And "General" SHOULD appear as a service category heading
    And all activities and subactivities under "General" should be visible
    And both service categories should be visible

  @general-suppression @mixed-services
  Scenario: General is suppressed even when non-suppressing service is also selected
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Banking" as a service
    And the user selects "Derivatives & FX" as a service
    And the user clicks the Search button
    Then the results should display in the Licensing Restrictions section
    And "Banking" should appear as a service category heading
    And "Derivatives & FX" should appear as a service category heading
    And "General" should NOT appear as a service category heading
    And all activities and subactivities under "General" should also be suppressed
    And the suppression rule takes precedence over display rules

  # ============================================================
  # Section 4: Filter Interaction and State Management
  # ============================================================

  @filter-interaction @clear-filters
  Scenario: Clear filters button resets all selections
    Given the user has selected "Argentina" as the jurisdiction
    And the user has selected "Banking" as the service
    When the user clicks the "Clear All Filters" button
    Then no jurisdictions should be selected
    And no services should be selected
    And the Search button should be disabled
    And the filters should return to their initial state

  @filter-interaction @remove-individual-jurisdiction
  Scenario: User can remove individual jurisdiction selections
    Given the user has selected the following jurisdictions:
      | Argentina |
      | Austria   |
      | Belgium   |
    When the user removes "Austria" from the selected jurisdictions
    Then only "Argentina" and "Belgium" should remain selected
    And the Search button should remain enabled if a service is selected

  @filter-interaction @remove-individual-service
  Scenario: User can remove individual service selections
    Given the user has selected "Argentina" as the jurisdiction
    And the user has selected the following services:
      | Banking           |
      | Corporate Finance |
    When the user removes "Corporate Finance" from the selected services
    Then only "Banking" should remain selected
    And the Search button should remain enabled

  @filter-interaction @jurisdiction-search
  Scenario: Jurisdiction filter supports search functionality
    When the user opens the Jurisdiction filter dropdown
    And the user types "Arg" in the search box
    Then only jurisdictions starting with "Arg" should be displayed
    And "Argentina" should be visible in the filtered list

  # ============================================================
  # Section 5: Results Display and Filter Consistency
  # ============================================================

  @results-display @service-headings
  Scenario: Results display matches selected services
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Banking" as a service
    And the user clicks the Search button
    Then the results section should display "Banking" as a heading
    And only questions related to Banking should be visible under that heading
    And no other service headings should appear

  @results-display @multiple-jurisdictions-comparison
  Scenario: Results display comparison for multiple jurisdictions
    When the user selects the following jurisdictions:
      | Argentina |
      | Austria   |
    And the user selects "Banking" as the service
    And the user clicks the Search button
    Then the results should display a comparison table
    And both "Argentina" and "Austria" should appear as columns
    And the comparison should show differences in licensing restrictions

  @results-display @general-in-results-only
  Scenario: General never appears in Service filter but appears in results when applicable
    When the user opens the Service filter dropdown
    Then "General" should NOT be visible in the dropdown options
    When the user selects "Argentina" as the jurisdiction
    And the user selects "Derivatives & FX" as a service
    And the user clicks the Search button
    Then "General" SHOULD appear as a service category heading in the results
    And this confirms General is results-only, not a filter option

  # ============================================================
  # Section 6: Edge Cases and Error Handling
  # ============================================================

  @edge-cases @no-results
  Scenario: System handles searches that return no results gracefully
    When the user selects a jurisdiction with no data for the selected service
    And the user clicks the Search button
    Then an appropriate "No results found" message should be displayed
    And the user should be able to modify filters and search again

  @edge-cases @filter-persistence
  Scenario: Filter selections persist during navigation within results
    Given the user has executed a search with selected filters
    When the user expands and collapses result sections
    Then the filter selections should remain unchanged
    And the user should not need to re-enter filter criteria

  @edge-cases @concurrent-filter-selection
  Scenario: System handles rapid filter changes correctly
    When the user rapidly selects and deselects multiple jurisdictions
    And the user rapidly selects and deselects multiple services
    Then the filter state should reflect the final selections
    And the Search button state should be accurate

  # ============================================================
  # Section 7: Accessibility and Usability
  # ============================================================

  @accessibility @keyboard-navigation
  Scenario: Filters are accessible via keyboard navigation
    When the user navigates to filters using Tab key
    Then all filter dropdowns should be reachable
    And the user should be able to select options using Enter/Space
    And the user should be able to close dropdowns using Escape

  @accessibility @screen-reader
  Scenario: Filter validation messages are announced to screen readers
    Given a screen reader is active
    When the user attempts to search without required selections
    Then the validation message should be announced
    And the reason for the disabled Search button should be clear

  @usability @filter-feedback
  Scenario: User receives visual feedback for filter selections
    When the user selects "Argentina" as the jurisdiction
    Then a visual indicator should show the selection count
    When the user selects "Banking" as the service
    Then the filter button should update to reflect the selection
    And the user should clearly see what has been selected
