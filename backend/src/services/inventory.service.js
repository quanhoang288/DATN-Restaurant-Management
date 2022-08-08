const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');

const createInventory = async (data, option = {}) =>
  db.Inventory.create(data, option);

const getInventoryList = async (params = {}) => {
  const where = params.filters || {};
  return db.Inventory.findAll({
    where,
    include: [
      {
        association: 'branch',
      },
    ],
  });
};

const getInventoryDetail = async (inventoryId) => {
  const inventory = db.Inventory.findByPk(inventoryId, {
    include: [
      {
        association: 'branch',
      },
    ],
  });
  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');
  }
  return inventory;
};

const updateInventory = async (inventoryId, data, option = {}) => {
  const inventory = await getInventoryDetail(inventoryId);
  inventory.set(data);
  return inventory.save(option);
};

const deleteInventory = async (inventoryId, option = {}) => {
  const inventory = await getInventoryDetail(inventoryId);
  return inventory.destroy(option);
};

module.exports = {
  createInventory,
  updateInventory,
  getInventoryDetail,
  getInventoryList,
  deleteInventory,
};
