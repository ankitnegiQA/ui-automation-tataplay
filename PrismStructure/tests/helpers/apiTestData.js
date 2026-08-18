const { faker } = require('@faker-js/faker/locale/en');
const registerData = require('../test-data/registerData.json');
const checkoutData = require('../test-data/checkoutData.json');

function generateUniquePassword() {
    return `TtnApi${Date.now()}!@#Xz`;
}

function buildRegisterPayload() {
    return {
        ...registerData.validUser,
        email: faker.internet.email().toLowerCase(),
        password: generateUniquePassword(),
    };
}

function buildInvalidEmailPayload() {
    return {
        ...registerData.validUser,
        email: registerData.invalidEmail,
        password: generateUniquePassword(),
    };
}

function buildShortPasswordPayload() {
    return {
        ...registerData.validUser,
        email: faker.internet.email().toLowerCase(),
        password: registerData.shortPassword,
    };
}

function createInvoiceBody(cartId) {
    return {
        ...checkoutData,
        cart_id: cartId,
    };
}

/** @deprecated Use createInvoiceBody — kept for backward compatibility */
const buildInvoicePayload = createInvoiceBody;

module.exports = {
    buildRegisterPayload,
    buildInvalidEmailPayload,
    buildShortPasswordPayload,
    createInvoiceBody,
    buildInvoicePayload,
    registerData,
    checkoutData,
};
