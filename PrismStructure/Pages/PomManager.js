const { LoginPage } = require('./LoginPage');
const { UserRegestration } = require('./UserRegestration');
const { Cart } = require('./Cart');
const { Checkout } = require('./Checkout');
const {OrderHistory} = require('./OrderHistory');

class PomManager {
    constructor(page) {
        this.page = page;
        this.LoginPage = new LoginPage(this.page);
        this.UserRegestration = new UserRegestration(this.page);
        this.Cart = new Cart(this.page);
        this.Checkout = new Checkout(this.page);
        this.OrderHistory = new OrderHistory(this.page);
    }

    getLoginPage() {
        return this.LoginPage;
    }

    getUserRegestration() {
        return this.UserRegestration;
    }

    getCart() {
        return this.Cart;
    }

    getCheckout() {
        return this.Checkout;
    }

    getOrderHistory() {
        return this.OrderHistory;
    }
}

module.exports = { PomManager };