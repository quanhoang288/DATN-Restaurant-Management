const Joi = require('joi');

const createKitchen = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1),
    type: Joi.string().required().default('food'),
    branch_id: Joi.number().required().positive(),
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
    page: Joi.number().positive(),
    perPage: Joi.number().positive(),
    filters: Joi.string(),
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
