const Twilio = require('twilio');

const config = require('../config/config');

const { accountId, authToken, messagingServiceSid } = config.twilio;

const client = new Twilio(accountId, authToken);

const sendMessage = (to, body) => {
  client.messages
    .create({
      messagingServiceSid,
      to,
      body,
    })
    .then((message) => console.log(message))
    .done();
};

module.exports = { sendMessage };
