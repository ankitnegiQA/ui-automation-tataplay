Feature: Login Functionality 
# Manual test cases
  Scenario: Verify successful login

    Given User launches the application
    When User logs in with valid credentials
    Then User should be logged in successfully