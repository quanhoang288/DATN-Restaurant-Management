const Joi = require('joi');

const createGood = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1),
    description: Joi.string(),
    quantity: Joi.number(),
    import_price: Joi.number().positive(),
    sale_price: Joi.number().positive(),
    min_quantity_threshold: Joi.number(),
    max_quantity_threshold: Joi.number(),
    is_sold_directly: Joi.bool().default(false),
    is_topping: Joi.bool().default(false),
  }),
};

const getGoods = {
  query: Joi.object().keys({}),
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
  body: {
    name: Joi.string().min(1),
    description: Joi.string(),
    quantity: Joi.number(),
    import_price: Joi.number().positive(),
    sale_price: Joi.number().positive(),
    min_quantity_threshold: Joi.number(),
    max_quantity_threshold: Joi.number(),
    is_sold_directly: Joi.bool(),
    is_topping: Joi.bool(),
  },
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
