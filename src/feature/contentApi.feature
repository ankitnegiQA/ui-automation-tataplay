Feature: Content Info API Validation
# Manual test cases
  Scenario: Validate Bee Movie content details

    Given User is logged into application
    When User calls content info API
    Then Validate vod details in response