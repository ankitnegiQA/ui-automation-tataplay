Feature: User Authentication & Cart Creation

  @api @auth
  Scenario: Register a new user, log in to obtain bearer token, and create a cart
    Given User registers a new account via API
    Then User registration should be successful
    When User logs in via API with registered credentials
    Then User should receive a valid bearer token
    When User creates a new cart via API
    Then Cart should be created successfully with a valid cart ID