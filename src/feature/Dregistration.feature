Feature: Customer Registration
  @ui @reg
  Scenario: Complete customer registration using auto-generated stored data 
    Given the user opens the registration page
    When the user completes and submits the registration form
    Then the user should be registered successfully