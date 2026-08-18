const { AuthApi } = require('./AuthApi');
const { CartApi } = require('./CartApi');
const { InvoiceApi } = require('./InvoiceApi');
const { ProductApi } = require('./productApi');

class ApiManager {
    constructor(request) {
        this.auth = new AuthApi(request);
        this.cart = new CartApi(request, this.auth);
        this.invoice = new InvoiceApi(request, this.auth);
        this.product = new ProductApi(request);
    }
}

module.exports = { ApiManager };
