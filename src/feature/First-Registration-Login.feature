Feature: AC1: User Registration & Login
  @ui @reg
  Scenario: Complete customer registration using auto-generated stored data 
    Given the user opens the registration page
    When the user completes and submits the registration form
    Then the user should be registered successfully

  @ui @login
  Scenario: Verify successful login

    Given User launches the application
    When User logs in with valid credentials
    When User should be logged in successfully
    Then Validate profile name and email on the profile page