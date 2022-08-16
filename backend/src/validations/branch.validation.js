const Joi = require('joi');

const getBranches = {
  query: Joi.object().keys({
    page: Joi.number().positive(),
    perPage: Joi.number().positive(),
    filters: Joi.string(),
  }),
};

module.exports = {
  getBranches,
};
