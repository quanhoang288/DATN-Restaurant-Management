const Joi = require('joi');

const createMenu = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1),
    type: Joi.string(),
    status: Joi.string(),
    categories: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        items: Joi.array().items(Joi.number().positive()),
      }),
    ),
  }),
};

const getMenus = () => {};

const getMenu = () => {};

const updateMenu = () => {};

const deleteMenu = () => {};

module.exports = {
  createMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu,
};
