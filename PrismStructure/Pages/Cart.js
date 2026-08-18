const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class Cart extends BasePage {
    constructor(page) {
        super(page);
        this.productNames = page.locator('[data-test="product-name"]');
        this.addToCartBttn = page.locator('#btn-add-to-cart');
        this.increaseQuantity = page.locator('#btn-increase-quantity');
        this.homeLink = page.getByRole('link',{name :"Home"});
        this.cart = page.locator('[data-test="nav-cart"]');
        this.productQunatity = page.locator('[data-test="product-quantity"]');
        this.cartTable = page.locator('table');
        this.row = page.locator('table tbody tr');
        this.productName = page.locator('[data-test="product-title"]');
    }

    async openHome() {
        await this.navigate('https://practicesoftwaretesting.com/');
    }

    async openProduct(productName)
    {
        await this.productNames.getByText(productName,{exact : true}).click();
    }

    async setQuantity(quantity=1)
    {
        for(let i=1;i<=quantity;i++)
        {
            await this.increaseQuantity.click();
        }
    }

    async clickAddToCartBttn()
    {
        await this.addToCartBttn.click();
    }

    async goHome()
    {
        await this.homeLink.click();
    }

    async openCart()
    {
        await this.cart.click();
    }

    async addProductInCart(products)
    {
        const items = products.map((item)=> typeof item === 'string' ? {name : item , quantity: 1} : item);
        await this.openHome();

        for(const {name , quantity=1} of items)
        {
            await this.openProduct(name);
            // await this.setQuantity(quantity);
            await this.clickAddToCartBttn();
            await this.page.waitForTimeout(5000);
            await this.goHome();
        }
    }

    async verifyProductInCart(products)
    {
        const expectedNames = [...new Set(
            products.map((item) => (typeof item === 'string' ? item : item.name))
        )];

        await this.cartTable.waitFor();
        const totalRows = this.row;
        const countTotalRows = await totalRows.count();
        expect(countTotalRows).toBe(expectedNames.length);

        const foundNames = [];
        for (let i = 0; i < countTotalRows; i++) {
            const productName = (
                await totalRows.nth(i).locator('[data-test="product-title"]').textContent()
            ).trim();
            foundNames.push(productName);
        }

        for (const name of expectedNames) {
            expect(foundNames).toContain(name);
        }
    }

}

module.exports = { Cart };
