const Joi = require('joi');

const createOrder = {
  body: Joi.object().keys({
    table: Joi.number().positive().allow(null),
    shipper_id: Joi.number().positive().allow(null),
    delivery_info_id: Joi.number().positive().allow(null),
    delivery_address: Joi.string().allow(null),
    delivery_status: Joi.string().allow(null),
    details: Joi.array().items(
      Joi.object().keys({
        id: Joi.number().positive(),
        quantity: Joi.number().positive(),
        status: Joi.string(),
      }),
    ),
    discounts: Joi.array(),
    type: Joi.string()
      .valid('dine-in', 'delivery', 'takeaway')
      .default('dine-in'),
    // status: Joi.string(),
    note: Joi.string().allow('', null),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    page: Joi.number().positive(),
    perPage: Joi.number().positive(),
    filters: Joi.string(),
  }),
};

const getOrder = {};

const updateOrder = {
  params: Joi.object().keys({
    id: Joi.number().positive().required(),
  }),
  body: Joi.object().keys({
    shipper_id: Joi.number().positive().allow(null),
    delivery_info_id: Joi.number().positive().allow(null),
    delivery_address: Joi.string().allow(null),
    table: Joi.number().positive(),
    details: Joi.array().items(
      Joi.object().keys({
        id: Joi.number().positive(),
        quantity: Joi.number().positive(),
        status: Joi.string(),
      }),
    ),
    discounts: Joi.array(),
    type: Joi.string().valid('dine-in', 'delivery', 'takeaway'),
    delivery_status: Joi.string(),
    payment_status: Joi.string(),
    prepare_status: Joi.string(),
    note: Joi.string().allow(''),
  }),
};

const deleteOrder = {};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
};
