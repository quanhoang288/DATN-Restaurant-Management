const Joi = require('joi');

const createTable = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1),
    floor_num: Joi.number().positive().required().default(1),
    order: Joi.number().positive().required(),
  }),
};

const getTable = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
};

const getTables = {
  query: Joi.object().keys({
    name: Joi.string(),
    floor_num: Joi.number().positive(),
    sort: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateTable = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(1),
    floor_num: Joi.number().positive(),
    order: Joi.number().positive(),
  }),
};

const deleteTable = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
};

module.exports = {
  createTable,
  getTable,
  getTables,
  updateTable,
  deleteTable,
};
