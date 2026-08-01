const config = require('../utility/Config');

class LoginPage {

    constructor(page) {
        this.page = page;
        // Automation Identifiers
        this.rmnTxt = page.locator('input[name="rmn"]');
        this.getOtpBtn = page.locator('//button[contains(.,"Get OTP")]');
        this.otpInputs = page.locator('input[autocomplete="one-time-code"]');
    }

    async navigateToLoginPage() {
        await this.page.goto(config.baseUrl);
        const notNowBtn = this.page.locator('//p[text()="Not Now"]');
        await notNowBtn.click();
        const loginBtn = this.page.locator('//button[text()="Login"]');
        await loginBtn.click();
    }

    async enterMobileNumber() {
        let mobileNumber = config.username;
        console.log(">>>>>> " +mobileNumber);
        await this.rmnTxt.fill(mobileNumber);
    }

    async clickGetOtp() {
        await this.getOtpBtn.click();
    }

    async enterOtp() {
        let otp = config.password;
        console.log(">>>>>> " +otp);
         for (let i = 0; i < otp.length; i++) {
            await this.otpInputs.nth(i).fill(otp[i]);
        }
    }
}

module.exports = LoginPage;