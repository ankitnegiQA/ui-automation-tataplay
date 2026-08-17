Feature: TataPlay UI End-to-End Coverage

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
