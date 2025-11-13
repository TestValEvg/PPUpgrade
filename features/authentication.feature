@authentication @smoke @critical
Feature: User Authentication and Login

  As a Crypto Reviewer user
  In order to access the platform and review crypto assets
  I need to authenticate with valid credentials

  Background:
    Given the user is on the authentication page

  @login-success
  Scenario: User can log in successfully with valid credentials
    When the user enters valid email and password
    And the user submits the login form
    Then the user should be authenticated successfully
    And the Product Platform title should be visible

  @login-invalid
  Scenario: User login fails with invalid credentials
    When the user enters invalid email or password
    And the user submits the login form
    Then the user should see an authentication error
    And the user should remain on the authentication page
