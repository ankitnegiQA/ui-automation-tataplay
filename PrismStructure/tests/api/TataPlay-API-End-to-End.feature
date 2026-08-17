Feature: TataPlay API End-to-End Coverage

  @api @auth @cart
  Scenario: API user registers, logs in, and creates a cart
    Given User registers a new account via API
    Then User registration should be successful
    When User logs in via API with registered credentials
    Then User should receive a valid bearer token
    When User creates a new cart via API
    Then Cart should be created successfully with a valid cart ID

  @api @products @invoice
  Scenario: API user selects a product and generates an invoice
    Given User is authenticated and has an active cart
    When User fetches the product list via API
    Then Product list should be retrieved successfully
    When User adds the first available product to the cart
    Then Product should be present in the cart contents
    When User generates an invoice with valid billing details
    Then Invoice should be created successfully
