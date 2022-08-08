const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');

const createUnit = async (data, option = {}) => {
  const { name } = data;
  const duplicateUnit = await db.Unit.findOne({ where: { name } });
  if (duplicateUnit) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Duplicate unit name');
  }
  return db.Unit.create(data, option);
};
const getUnits = async (params = {}) => {
  const where = params.filters || {};
  return db.Unit.findAll({ where });
};

module.exports = {
  createUnit,
  getUnits,
};
