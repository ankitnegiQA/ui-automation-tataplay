Feature: E-Commerce Product Purchase and Invoice Verification

  Acceptance Criteria:
  - User can browse and select products from the catalog.
  - User can add multiple items to the cart and update item quantities.
  - User can complete checkout selecting Cash on Delivery (COD).
  - User can view the generated order invoice under "My Invoices".

   @ui @purchase
  Scenario: Successfully purchase products via Cash on Delivery and verify invoice
    Given User is logged in with valid credentials
    When User browses catalog and adds multiple products to the cart
    And User updates the quantity of an item in the cart
    And User completes the checkout process using Cash on Delivery
    Then User should see the generated invoice under My Invoices