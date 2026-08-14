Feature: Product Selection & Invoice Generation
Using the bearer token, the user should be able to retrieve products, add selected products to the cart, verify the cart contents, and successfully generate an invoice with the required customer and order details. 

  @api @cart
  Scenario: Successfully retrieve products, manage cart, and generate invoice
    Given User is authenticated and has an active cart
    When User fetches the product list via API
    Then Product list should be retrieved successfully
    When User adds the first available product to the cart
    Then Product should be present in the cart contents
    When User generates an invoice with valid billing details
    Then Invoice should be created successfully