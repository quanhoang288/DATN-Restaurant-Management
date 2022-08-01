const Joi = require('joi');

const createGood = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1),
    description: Joi.string().allow(''),
    quantity: Joi.number(),
    import_price: Joi.number().positive(),
    sale_price: Joi.number().positive(),
    min_quantity_threshold: Joi.number(),
    max_quantity_threshold: Joi.number(),
    components: Joi.array().items(
      Joi.object().keys({
        good_id: Joi.number().positive(),
        quantity: Joi.number().positive(),
      }),
    ),
    type: Joi.string()
      .required()
      .valid('ready_served', 'combo', 'ingredient', 'fresh_served'),
    attributes: Joi.array().items(
      Joi.object().keys({
        name: Joi.string(),
        values: Joi.array()
          .items(
            Joi.object().keys({
              value: Joi.string().min(1),
            }),
          )
          .unique((val1, val2) => val1.value !== val2.value),
      }),
    ),
    units: Joi.array().items(
      Joi.object().keys({
        name: Joi.string(),
        is_default_unit: Joi.bool().default(false),
      }),
    ),
  }),
};

const getGoods = {
  query: Joi.object().keys({
    page: Joi.number(),
    perPage: Joi.number().positive(),
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
