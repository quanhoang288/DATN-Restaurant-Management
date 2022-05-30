const Joi = require('joi');

const createKitchen = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1),
    type: Joi.string().required().default('food'),
    floor_num: Joi.number().positive().default(1),
  }),
};

const getKitchen = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
};

const getKitchens = {
  query: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string(),
    sort: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateKitchen = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(1),
    type: Joi.string().min(1),
    floor_num: Joi.number().positive(),
  }),
};

const deleteKitchen = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
};

module.exports = {
  createKitchen,
  getKitchen,
  getKitchens,
  updateKitchen,
  deleteKitchen,
};
