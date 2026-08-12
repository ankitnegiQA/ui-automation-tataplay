import config from '../utility/Config.js';

class CartPage {
  constructor(request) {
    if (!request) {
      throw new Error('API Request Context is missing! Pass a valid Playwright request context.');
    }
    this.request = request;
    this.apiBaseUrl = config.apiBaseUrl || 'https://api.practicesoftwaretesting.com';
  }

  async getProducts() {
    const targetUrl = new URL('/products', this.apiBaseUrl).toString();
    return await this.request.get(targetUrl, {
      headers: { 'Accept': 'application/json' }
    });
  }

  async addProductToCart(cartId, productId, quantity = 1, authToken = null) {
    const targetUrl = new URL(`/carts/${cartId}`, this.apiBaseUrl).toString();
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    return await this.request.post(targetUrl, {
      headers,
      data: { product_id: productId, quantity }
    });
  }

  async getCartDetails(cartId) {
    const targetUrl = new URL(`/carts/${cartId}`, this.apiBaseUrl).toString();
    return await this.request.get(targetUrl, {
      headers: { 'Accept': 'application/json' }
    });
  }

  async checkPayment(paymentMethod = 'cash-on-delivery', authToken = null) {
    const targetUrl = new URL('/payment/check', this.apiBaseUrl).toString();
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    return await this.request.post(targetUrl, {
      headers,
      data: { payment_method: paymentMethod, payment_details: {} }
    });
  }

  async generateInvoice(invoicePayload, authToken = null) {
    const targetUrl = new URL('/invoices', this.apiBaseUrl).toString();
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    return await this.request.post(targetUrl, {
      headers,
      data: invoicePayload
    });
  }
  async lookupPostcode(country, postcode, houseNumber) {
  const targetUrl = new URL('/postcode-lookup', this.apiBaseUrl);
  targetUrl.searchParams.append('country', country);
  targetUrl.searchParams.append('postcode', postcode);
  targetUrl.searchParams.append('house_number', houseNumber);

  return await this.request.get(targetUrl.toString(), {
    headers: { 'Accept': 'application/json' }
  });
}
}

export default CartPage;