const Joi = require('joi');

const createDiscount = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1),
    type: Joi.string().valid('invoice', 'good').required(),
    method: Joi.string()
      .valid(
        'invoice-discount',
        'invoice-giveaway',
        'good-discount',
        'good-giveaway',
      )
      .required(),
    description: Joi.string().allow(''),
    status: Joi.string().allow('', null),
    is_enabled: Joi.bool().default(true),
    start_date: Joi.date().required(),
    end_date: Joi.date().greater(Joi.ref('start_date')).required(),
    is_applied_to_all_customers: Joi.bool().default(true),
    is_auto_applied: Joi.bool().default(false),
    // constraints: Joi.array().when('method', {
    //   is: 'invoice-discount',
    //   then: Joi.array().items(
    //     Joi.object().keys({
    //       min_invoice_value: Joi.number().positive(),
    //       discount_amount: Joi.number().positive(),
    //       discount_unit: Joi.string(),
    //     }),
    //   ),
    // }),
  }),
};

const getDiscounts = {
  query: Joi.object().keys({
    page: Joi.number().positive(),
    perPage: Joi.number().positive(),
    filters: Joi.string(),
  }),
};

const getDiscount = () => {};

const updateDiscount = {
  params: Joi.object().keys({
    id: Joi.number().positive(),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(1),
    type: Joi.string().valid('invoice', 'good'),
    method: Joi.string().valid(
      'invoice-discount',
      'invoice-giveaway',
      'good-discount',
      'good-giveaway',
    ),
    start_date: Joi.date(),
    end_date: Joi.date().greater(Joi.ref('start_date')),
    is_applied_to_all_customers: Joi.bool().default(true),
    is_auto_applied: Joi.bool().default(false),
  }),
};

const deleteDiscount = () => {};

module.exports = {
  createDiscount,
  getDiscounts,
  getDiscount,
  updateDiscount,
  deleteDiscount,
};
