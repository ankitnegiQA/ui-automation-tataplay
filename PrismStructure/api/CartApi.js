class CartApi {
    constructor(request, authApi) {
        this.request = request;
        this.authApi = authApi;
        this.baseUrl = 'https://api.practicesoftwaretesting.com';
    }

    async createCart(token) {
        return this.request.post(`${this.baseUrl}/carts`, {
            headers: this.authApi.authHeaders(token),
            data: {},
        });
    }

    async addItem(cartId, productId, quantity, token) {
        return this.request.post(`${this.baseUrl}/carts/${cartId}`, {
            headers: this.authApi.authHeaders(token),
            data: { product_id: productId, quantity },
        });
    }

    async getCart(cartId, token) {
        return this.request.get(`${this.baseUrl}/carts/${cartId}`, {
            headers: this.authApi.authHeaders(token),
        });
    }
}

module.exports = { CartApi };
