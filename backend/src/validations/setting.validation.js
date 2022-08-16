const Joi = require('joi');

const saveSettings = {
  body: Joi.object().keys({
    settings: Joi.array().items(
      Joi.object().keys({
        name: Joi.string(),
        value: Joi.string(),
      }),
    ),
  }),
};

module.exports = { saveSettings };
