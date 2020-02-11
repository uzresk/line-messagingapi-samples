// process.env.API_BASE_URL = "http://localhost:8080/bot";
const line = require('@line/bot-sdk');
const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};
const client = new line.Client(config);

module.exports = async (context, req) => {

    req.body.events.map(await handleMessage);
};

const handleMessage = async (event) => {

    switch (event.type) {
        case 'message':
            return messageEvent(event);
        default:
            return Promise.resolve(null);
    }
};


const messageEvent = async (event) => {

    const message = event.message.text;

    var lineMsg = {};
    if (message.includes('絵文字込みテキスト')) {
        lineMsg = {
            type: 'text',
            text: '絵文字込みのテキストを表示します。\uDBC0\uDC84'
        }
    } else if (message.includes('スタンプ')) {
        lineMsg = {
            "type": "sticker",
            "packageId": "1",
            "stickerId": "1"
        }
    } else if(message.includes('こんにちは')) {
        const profile = await client.getProfile(event.source.userId);
        lineMsg = {
            type: 'text',
            text: 'こんにちは！' + profile.displayName + 'さん'
        }
    } else {
        lineMsg = {
            type: 'text',
            text: message
        }
    }
    return client.pushMessage(event.source.userId, lineMsg);
    // return client.replyMessage(event.replyToken, lineMsg);
    //     .catch(e => {
    //         console.error("errorが発生しました。")
    //         console.error(e);
    //         throw e
    //     })
};

