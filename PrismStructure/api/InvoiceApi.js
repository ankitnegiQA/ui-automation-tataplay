class InvoiceApi {
    constructor(request, authApi) {
        this.request = request;
        this.authApi = authApi;
        this.baseUrl = 'https://api.practicesoftwaretesting.com';
    }

    async createInvoice(payload, token) {
        return this.request.post(`${this.baseUrl}/invoices`, {
            headers: this.authApi.authHeaders(token),
            data: payload,
        });
    }

    async getInvoice(invoiceId, token) {
        return this.request.get(`${this.baseUrl}/invoices/${invoiceId}`, {
            headers: this.authApi.authHeaders(token),
        });
    }
}

module.exports = { InvoiceApi };
