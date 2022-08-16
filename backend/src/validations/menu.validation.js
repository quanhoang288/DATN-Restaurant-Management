const Joi = require('joi');

const createMenu = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1),
    type: Joi.string().required().valid('food', 'beverage').default('food'),
    is_active: Joi.number().required().valid(0, 1).default(1),
    // categories: Joi.array().items(
    //   Joi.object().keys({
    //     name: Joi.string().required(),
    //     items: Joi.array().items(Joi.number().positive()),
    //   }),
    // ),
  }),
};

const getMenus = {
  query: Joi.object().keys({
    page: Joi.number().positive(),
    perPage: Joi.number().positive(),
    filters: Joi.string(),
  }),
};

const getMenu = {
  params: Joi.object().keys({
    id: Joi.number().positive().required(),
  }),
};

const updateMenu = {
  params: Joi.object().keys({
    id: Joi.number().positive().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(1),
    type: Joi.string(),
    is_active: Joi.number().required().valid(0, 1).default(1),
    // categories: Joi.array().items(
    //   Joi.object().keys({
    //     id: Joi.number().positive(),
    //     name: Joi.string(),
    //     items: Joi.array().items(Joi.number().positive()),
    //   }),
    // ),
  }),
};

const deleteMenu = {
  params: Joi.object().keys({
    id: Joi.number().positive().required(),
  }),
};

module.exports = {
  createMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu,
};
