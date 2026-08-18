/**
 * Seeded demo accounts (shared public DB — accounts can get locked from failed attempts).
 * Fallback list if one is locked: customer2 → customer3 → admin
 * @see https://testsmith-io.github.io/practice-software-testing/#/
 */
const TEST_USER = {
    email: 'shubh.1785751327098@example.com',
    password: 'TTNNew1234!@#$',
};

module.exports = { TEST_USER };
