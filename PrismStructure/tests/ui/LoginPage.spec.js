const { test, expect } = require('@playwright/test');
const { PomManager } = require('../../Pages/PomManager');
const { buildUiRegisterData } = require('../helpers/uiTestData');

test('TC_UI_01 User Registration and Login @Smoke', async ({ page }) => {
    const pomManager = new PomManager(page);
    const loginPage = pomManager.getLoginPage();
    const userRegestration = pomManager.getUserRegestration();
    const user = buildUiRegisterData();

    await loginPage.navigate('https://practicesoftwaretesting.com/');
    await loginPage.goToSignUp();

    await expect(page).toHaveURL(/.*auth\/register/);

    await userRegestration.UserData(
        user.first_name,
        user.last_name,
        user.dob,
        user.country,
        user.postal_code,
        user.house_number,
        user.street,
        user.city,
        user.state,
        user.phone,
        user.email,
        user.password
    );
    await expect(page).toHaveURL(/.*auth\/login/);

    await loginPage.login(user.email, user.password);
    await expect(page).not.toHaveURL(/.*auth\/login/);
});
