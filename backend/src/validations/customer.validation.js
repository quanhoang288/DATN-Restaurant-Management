const Joi = require('joi');

const createCustomer = {};

const getCustomers = {
  query: Joi.object().keys({
    page: Joi.number().positive(),
    perPage: Joi.number().positive(),
    filters: Joi.string(),
  }),
};

const getCustomer = {};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
};
