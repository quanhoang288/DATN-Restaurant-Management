const Twilio = require('twilio');
// const Vonage = require('@vonage/server-sdk');

const config = require('../config/config');

const { accountId, authToken, phoneNumber } = config.twilio;

const client = new Twilio(accountId, authToken);

// const { apiKey, apiSecret } = config.nexmo;

// const vonage = new Vonage({
//   apiKey,
//   apiSecret,
// });

const sendMessage = (to, body) => {
  // vonage.message.sendSms('Final Project Application', to, body);
  client.messages.create({
    from: phoneNumber,
    to,
    body,
  });
};

module.exports = { sendMessage };
