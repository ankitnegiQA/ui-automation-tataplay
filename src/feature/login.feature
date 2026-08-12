Feature: Login Functionality 

  @ui @test
  Scenario: Verify successful login

    Given User launches the application
    When User logs in with valid credentials
    When User should be logged in successfully
    Then Validate profile name and email on the profile page