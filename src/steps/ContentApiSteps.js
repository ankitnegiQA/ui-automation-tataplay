const { Given, When, Then } = require('@cucumber/cucumber');
const ContentApiPage = require('../pom/ContentApiPage');

let response;
const contentApiPage = new ContentApiPage();

Given('User is logged into application', async function () {
    console.log('User already logged in');
});

When('User calls content info API', async function () {

    response = await contentApiPage.getContentInfo();

    console.log('================ RESPONSE START ================');
    console.log(JSON.stringify(response, null, 2));
    console.log('================ RESPONSE END ==================');
});

Then('Validate vod details in response', async function () {

    console.log('================ DEBUG START ===================');
    console.log('Response Type :', typeof response);

    if (response) {
        console.log('Response Keys :', Object.keys(response));
    }

    console.log('Full Response :');
    console.log(JSON.stringify(response, null, 2));

    console.log('================ DEBUG END =====================');
});