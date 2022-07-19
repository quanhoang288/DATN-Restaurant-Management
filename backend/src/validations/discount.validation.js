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
    constraints: Joi.array(),
    // constraints: Joi.array().items(
    //   Joi.object().keys({
    //     discount_amount: Joi.number().positive(),
    //     discount_unit: Joi.string().valid('cash', 'percent', 'sale_price'),
    //     min_invoice_value: Joi.number().positive(),
    //     constraintGoods: Joi.array().items(
    //       Joi.object().keys({
    //         good_id: Joi.number().positive(),
    //         quantity: Joi.number().positive(),
    //         is_discount_item: Joi.bool().default(false),
    //       }),
    //     ),
    //     constraintGoodGroups: Joi.array().items(
    //       Joi.object().keys({
    //         good_group_id: Joi.number().positive(),
    //         quantity: Joi.number().positive(),
    //         is_discount_item: Joi.bool().default(false),
    //       }),
    //     ),
    //   }),
    // ),
    hours: Joi.array().items(
      Joi.object().keys({
        fromHour: Joi.string(),
        toHour: Joi.string(),
      }),
    ),
  }),
};

const getDiscounts = () => {};

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
    constraints: Joi.array().items(
      Joi.object().keys({
        discount_amount: Joi.number().positive(),
        discount_unit: Joi.string().valid('cash', 'percent', 'sale_price'),
        min_invoice_value: Joi.number().positive(),
        constraintGoods: Joi.array().items(
          Joi.object().keys({
            good_id: Joi.number().positive(),
            is_discount_item: Joi.bool().default(false),
          }),
        ),
        constraintGoodGroups: Joi.array().items(
          Joi.object().keys({
            good_group_id: Joi.number().positive(),
            quantity: Joi.number().positive(),
            is_discount_item: Joi.bool().default(false),
          }),
        ),
      }),
    ),
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
