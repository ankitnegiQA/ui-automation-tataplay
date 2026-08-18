const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class OrderHistory extends BasePage {
    constructor(page) {
        super(page);
        this.profile = page.locator('[data-test="nav-menu"]');
        this.myInvoices = page.locator('[data-test="nav-my-invoices"]');
        this.invoiceRows = page.locator('table tbody tr');
        // Detail page shows values in inputs/labels — not plain text nodes
        this.invoiceNumberField = page.getByLabel('Invoice Number');
    }

    async selectInvoice() {
        await this.profile.click();
        await this.myInvoices.click();
        await expect(this.page).toHaveURL(/.*\/account\/invoices/);
    }

    async openInvoice(invoiceNumber) {
        await this.selectInvoice();
        const row = this.invoiceRows.filter({ hasText: invoiceNumber });
        await expect(row).toBeVisible();
        await row.getByRole('link').first().click();

        await expect(this.page).toHaveURL(/.*\/account\/invoices\//);
        // Invoice number is in an input — getByText() won't find input values
        await expect(this.invoiceNumberField).toHaveValue(invoiceNumber);
    }
}

module.exports = { OrderHistory };
