const Joi = require('joi');

const createGoodGroup = {
  body: Joi.object().keys({
    code: Joi.string().required().min(1),
    name: Joi.string().required().min(1),
  }),
};

const updateGoodGroup = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
  body: Joi.object().keys({
    code: Joi.string().min(1),
    name: Joi.string().min(1),
  }),
};

const getGoodGroups = {
  query: Joi.object().keys({
    name: Joi.string(),
    sort: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getGoodGroup = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
};

const deleteGoodGroup = {
  params: Joi.object().keys({
    id: Joi.number(),
  }),
};

module.exports = {
  createGoodGroup,
  updateGoodGroup,
  getGoodGroup,
  getGoodGroups,
  deleteGoodGroup,
};
