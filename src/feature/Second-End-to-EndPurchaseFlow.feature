Feature: End-to-End Purchase Flow
  Acceptance Criteria:
The user should be able to browse products, add multiple items to the cart (including updating quantity), complete the checkout using Cash on Delivery, and successfully view the generated invoice under My Invoices. Suggestion to use like AC's 
** For Invoiceid press confirm button on application twice


   @ui @purchase
  Scenario: Successfully purchase products via Cash on Delivery and verify invoice
    Given User is logged in with valid credentials
    When User browses catalog and adds multiple products to the cart
    And User updates the quantity of an item in the cart
    And User completes the checkout process using Cash on Delivery
    Then User should see the generated invoice under My Invoices