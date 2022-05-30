const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');

const createKitchen = async (data, option = {}) =>
  db.Kitchen.create(data, option);

const updateKitchen = async (kitchenId, data, option = {}) => {
  const kitchen = await db.Kitchen.findByPk(kitchenId);
  if (!kitchen) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Kitchen not found');
  }
  kitchen.set(data);
  return kitchen.save(option);
};

const getKitchenList = async () => db.Kitchen.findAll({});

const getKitchenDetail = async (kitchenId) => {
  const kitchen = db.Kitchen.findByPk(kitchenId);
  if (!kitchen) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kitchen not found');
  }
  return kitchen;
};

const deleteKitchen = async (kitchenId, option = {}) => {
  const kitchen = await db.Kitchen.findByPk(kitchenId);
  if (!kitchen) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Kitchen not found');
  }
  return kitchen.destroy(option);
};

module.exports = {
  createKitchen,
  updateKitchen,
  getKitchenDetail,
  getKitchenList,
  deleteKitchen,
};
