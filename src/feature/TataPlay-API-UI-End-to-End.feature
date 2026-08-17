Feature: TataPlay API and UI End-to-End Coverage

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

  @ui @registration @login
  Scenario: UI user registers and verifies successful login
    Given the user opens the registration page
    When the user completes and submits the registration form
    Then the user should be registered successfully
    Given User launches the application
    When User logs in with valid credentials
    Then User should be logged in successfully
    And Validate profile name and email on the profile page

  @ui @purchase
  Scenario: UI user purchases products with Cash on Delivery and verifies invoice
    Given User is logged in with valid credentials
    When User browses catalog and adds multiple products to the cart
    And User updates the quantity of an item in the cart
    And User completes the checkout process using Cash on Delivery
    Then User should see the generated invoice under My Invoices
