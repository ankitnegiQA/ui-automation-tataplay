const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.signIn = page.getByRole('link', { name: 'Sign in' });
        this.registerLink = page.getByRole('link', { name: 'Register your account' });
        this.email = page.getByLabel('Email address').first();
        this.password = page.getByLabel('Password').first();
        this.loginBtn = page.getByRole('button', { name: 'Login' });
        this.loginError = page.locator('[data-test="login-error"]');
    }

    async clickSignIn() {
        await this.signIn.click();
    }

    async clickRegister() {
        await this.registerLink.click();
    }

    async goToSignUp() {
        await this.clickSignIn();
        await this.clickRegister();
    }

    /**
     * Login and wait until we leave /auth/login (no fixed sleeps).
     */
    async login(email, password) {
        await this.navigate('https://practicesoftwaretesting.com/auth/login');
        await this.email.fill(email);
        await this.password.fill(password);
        await this.clickLogin();

        // Prefer a clear credential error over a generic timeout
        await Promise.race([
            this.page.waitForURL((url) => !url.pathname.includes('/auth/login')),
            this.loginError.waitFor({ state: 'visible' }),
        ]);

        if (await this.loginError.isVisible()) {
            const message = (await this.loginError.textContent())?.trim();
            throw new Error(`Login failed for ${email}: ${message}`);
        }

        await expect(this.page).not.toHaveURL(/.*auth\/login/);
    }

    async clickLogin() {
        await this.loginBtn.click();
    }
}

module.exports = { LoginPage };
