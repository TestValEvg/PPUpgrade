@navigator @quarterly-update @regression
Feature: Navigator Quarterly Update Reporting

  As a Navigator user
  I need to access and generate quarterly update reports
  So that I can track changes, updates, and jurisdictional information across services

  Background:
    Given the user is authenticated and logged in
    And the user has appropriate service permissions

  # ============================================================
  # Section 1: Access and Navigation
  # ============================================================

  @access @navigation
  Scenario: User can access Quarterly Update reporting from existing navigation link
    Given the user is on the Navigator page
    When the user clicks the Quarterly Update Reporting link
    Then a new browser tab should open
    And the Quarterly Update reporting page should load in the new tab
    And the original Navigator page should remain open in the previous tab
    And the new page should display the AI Quarterly Update Reporting interface

  @navigation @back-to-search
  Scenario: User can navigate back to content search from Quarterly Update page
    Given the Quarterly Update Reporting page is open in a new tab
    When the user clicks the Content Search page link
    Then the user should be navigated back to the Content Search page
    And the navigation should occur within the same tab
    And the page should load successfully without errors

  # ============================================================
  # Section 2: Data Display Based on Permissions
  # ============================================================

  @data-display @permissions
  Scenario: User only sees information for services they have access to
    Given the user has access to specific services
    When the user views the Quarterly Update page
    Then only data for permitted services should be displayed
    And restricted services should not be visible

  @data-display @calculations
  Scenario: Dashboard displays calculated metrics for user's services
    Given the user is on the Quarterly Update page
    And the user has access to multiple services
    Then the following metrics should be automatically calculated:
      | Changes Published       |
      | Updates in Progress     |
      | Jurisdictions Affected  |
      | Services Count          |
    And all calculations should be accurate and up-to-date

  # ============================================================
  # Section 3: Build Custom Report - Filter Selection
  # ============================================================

  @custom-report @report-type
  Scenario: User can select one report type
    Given the user is in the "Build a custom report" section
    When the user views the Report Type filter
    Then the user should be able to select exactly one report type
    And only one selection should be allowed at a time

  @custom-report @services-selection
  Scenario: User can select services based on permissions
    Given the user is building a custom report
    When the user opens the Services filter
    Then only services the user has permission to access should be available
    And the user should be able to select one, many, or all services

  @custom-report @services-select-all
  Scenario: User can select all available services
    Given the user has access to multiple services
    When the user opens the Services filter
    And the user clicks "Select All"
    Then all available services should be selected
    And the user can proceed with the report generation

  @custom-report @regions-selection
  Scenario: User can select regions based on permissions
    Given the user is building a custom report
    When the user opens the Regions filter
    Then only regions the user has permission to access should be available
    And the user should be able to select one, many, or all regions

  @custom-report @regions-select-all
  Scenario: User can select all available regions
    Given the user has access to multiple regions
    When the user opens the Regions filter
    And the user clicks "Select All"
    Then all available regions should be selected
    And the selection should be reflected in the report criteria

  @custom-report @jurisdictions-selection
  Scenario: User can select jurisdictions based on selected regions
    Given the user has selected one or more regions
    When the user opens the Jurisdictions filter
    Then only jurisdictions related to the selected regions should be available
    And jurisdictions should be filtered by user permissions

  @custom-report @jurisdictions-select-all
  Scenario: User can select all available jurisdictions
    Given the user has selected regions
    And multiple jurisdictions are available
    When the user clicks "Select All" in the Jurisdictions filter
    Then all available jurisdictions should be selected
    And the user can proceed with filtered jurisdictions

  @custom-report @change-type
  Scenario: User can select change type with default selection
    Given the user is building a custom report
    When the user views the Change Type filter
    Then both options should be selected by default
    And the user should be able to select one or both change types

  @custom-report @timeframe
  Scenario: Timeframe shows last 4 updates in date order
    Given the user is building a custom report
    When the user views the Timeframe filter
    Then the last 4 updates should be displayed
    And they should be ordered by date from left to right
    And the timeframe should be automatically updated

  # ============================================================
  # Section 6: Report Generation and Output
  # ============================================================

  @custom-report @generate-report
  Scenario: User can generate a custom report with selected filters
    Given the user has selected all required filters:
      | Report Type     |
      | Services        |
      | Regions         |
      | Jurisdictions   |
      | Change Type     |
      | Timeframe       |
    When the user clicks the Generate Report button
    Then a custom report should be generated
    And the report should contain data matching the selected filters

  @custom-report @report-output
  Scenario: Custom generated report displays with proper structure
    Given a custom report has been generated
    Then the report should display with proper content structure
    And document navigation should be available
    And the report should be well-formatted and readable

  @custom-report @export-word
  Scenario: User can export custom report to Word
    Given a custom report has been generated
    When the user clicks the "Export to Word" button
    Then the report should be downloaded as a Word document
    And the document should maintain proper formatting

  @custom-report @export-pdf
  Scenario: User can export custom report to PDF
    Given a custom report has been generated
    When the user clicks the "Export to PDF" button
    Then the report should be downloaded as a PDF
    And the PDF should be properly formatted

  # ============================================================
  # Section 7: Extract Status Table
  # ============================================================

  @status-table @display
  Scenario: User can view extract status table
    Given the user has generated a report
    When the user navigates to the extract status table section
    Then the status table should be displayed
    And the table should show relevant status information

  @status-table @export-word
  Scenario: User can export status table to Word
    Given the extract status table is displayed
    When the user clicks the "Export to Word" button
    Then the status table should be exported as a Word document
    And the export should maintain table structure

  @status-table @export-pdf
  Scenario: User can export status table to PDF
    Given the extract status table is displayed
    When the user clicks the "Export to PDF" button
    Then the status table should be exported as a PDF
    And the table formatting should be preserved

  # ============================================================
  # Section 8: Validation and Error Handling
  # ============================================================

  @validation @required-filters
  Scenario: Generate button is disabled without required selections
    Given the user is building a custom report
    When required filters have not been selected
    Then the Generate Report button should be disabled
    And the user should see guidance on required selections

  @validation @permission-restrictions
  Scenario: User cannot access services without proper permissions
    Given the user lacks permissions for certain services
    When the user attempts to select restricted services
    Then those services should not be available in the dropdown
    And only permitted services should be selectable

