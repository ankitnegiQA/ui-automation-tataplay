const { BasePage } = require('./BasePage');

class UserRegestration extends BasePage {
    constructor(page) {
        super(page);
        this.firstName = page.getByLabel('First name');
        this.lastName = page.getByLabel('Last name');
        this.dob = page.getByLabel('Date of Birth');
        this.country = page.getByLabel('Country');
        this.postalCode = page.getByLabel('Postal code');
        this.houseNumber = page.getByLabel('House number');
        this.street = page.getByLabel('Street');
        this.city = page.getByLabel('City');
        this.state = page.getByLabel('State');
        this.phone = page.getByLabel('Phone');
        this.email = page.getByLabel('Email address');
        this.password = page.getByLabel('Password');
        this.registerBtn = page.getByRole('button', { name: 'Register' });
    }


    async UserData(firstName, lastName, dob, country, postalCode, houseNumber, street, city, state, phone, email, password) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.dob.fill(dob);
        await this.country.selectOption({ label: country });
        await this.postalCode.fill(postalCode);
        await this.houseNumber.fill(houseNumber);
        await this.street.fill(street);
        await this.city.fill(city);
        await this.state.fill(state);
        await this.phone.fill(phone);
        await this.email.fill(email);
        await this.password.fill(password);
        await this.clickRegister();
    }

    async clickRegister() {
        await this.registerBtn.click();
    }
}

module.exports = { UserRegestration };
