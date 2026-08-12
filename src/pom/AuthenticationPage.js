import config from '../utility/Config.js';

class AuthenticationPage {
  constructor(request) {
    if (!request) {
      throw new Error('API Request Context is missing! Pass a valid Playwright request context.');
    }
    this.request = request;
    this.apiBaseUrl = config.apiBaseUrl;
  }

  /**
   * Helper method for POST requests
   */
  async postRequest(endpoint, data = {}, headers = {}) {
    const targetUrl = new URL(endpoint, this.apiBaseUrl).toString();
    return await this.request.post(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
      },
      data
    });
  }

  /**
   * POST /users/register
   */
  async registerUser(userData) {
    return await this.postRequest('/users/register', userData);
  }

  /**
   * POST /users/login
   */
  async loginUser(email, password) {
    return await this.postRequest('/users/login', { email, password });
  }

  /**
   * POST /carts
   */
  async createCart(authToken = null) {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    return await this.postRequest('/carts', {}, headers);
  }
  async getUserProfile(authToken) {
    return await this.getRequest('/users/me', {
      Authorization: `Bearer ${authToken}`
    });
  }
  /**
   * Helper method for GET requests
   */
  async getRequest(endpoint, headers = {}) {
    const targetUrl = new URL(endpoint, this.apiBaseUrl).toString();
    return await this.request.get(targetUrl, {
      headers: {
        'Accept': 'application/json',
        ...headers
      }
    });
  }
}

export default AuthenticationPage;