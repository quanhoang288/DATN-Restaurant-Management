const Joi = require('joi');

const createGood = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1),
    description: Joi.string().allow(''),
    sale_price: Joi.number().positive(),
    min_quantity_threshold: Joi.number(),
    max_quantity_threshold: Joi.number(),
    type: Joi.string()
      .required()
      .valid('ready_served', 'combo', 'ingredient', 'fresh_served'),
  }),
};

const getGoods = {
  query: Joi.object().keys({
    page: Joi.number(),
    perPage: Joi.number().positive(),
    filters: Joi.string(),
  }),
};

const getGood = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
};

const updateGood = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string().allow(''),
    sale_price: Joi.number().positive(),
    min_quantity_threshold: Joi.number(),
    max_quantity_threshold: Joi.number(),
    type: Joi.string().valid(
      'ready_served',
      'combo',
      'ingredient',
      'fresh_served',
    ),
  }),
};

const deleteGood = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
};

module.exports = {
  createGood,
  updateGood,
  getGoods,
  getGood,
  deleteGood,
};
