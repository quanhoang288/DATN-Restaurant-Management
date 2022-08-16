const Joi = require('joi');

const createStaff = () => {};

const getStaffList = {
  query: Joi.object().keys({
    page: Joi.number().positive(),
    perPage: Joi.number().positive(),
    filters: Joi.string(),
  }),
};

const getStaff = () => {};

const updateStaff = () => {};

const deleteStaff = () => {};

module.exports = {
  createStaff,
  getStaffList,
  getStaff,
  updateStaff,
  deleteStaff,
};
