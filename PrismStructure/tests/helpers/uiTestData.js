const { faker } = require('@faker-js/faker/locale/en');
const { registerData } = require('./apiTestData');

/**
 * UI registration data — faker email + static fields from registerData.json
 */
function buildUiRegisterData() {
    return {
        ...registerData.validUserUi,
        email: faker.internet.email().toLowerCase(),
    };
}

module.exports = { buildUiRegisterData };
