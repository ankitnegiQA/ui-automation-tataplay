const { request } = require('@playwright/test');

class ContentApiPage {

    async getContentInfo() {

        const apiContext = await request.newContext();

        const response = await apiContext.get(
            'https://uat-tb.tapi.videoready.tv/content-subscriber-detail/api/content/info/vod/3358624?subscriberId=3001701022&profileId=48318b38-bd34-445b-b81c-342ef2cd4e0c',
            {
                headers: {
                    authorization: 'ixrRWL1cKBM5TEneZT1H2Aei17sjrTeW',
                    devicetype: 'WEB',
                    platform: 'BINGE_ANYWHERE',
                    subscriberid: '3001701022',
                    subscriptiontype: 'FREEMIUM',
                    dthstatus: 'DTH With Binge New Stack'
                }
            }
        );

        console.log('Status Code :', response.status());

        return await response.json();
    }
}

module.exports = ContentApiPage;