const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { inventoryService } = require('../services');

const createInventory = catchAsync(async (req, res) => {
  const Inventory = await inventoryService.createInventory(req.body);
  res.status(httpStatus.CREATED).send(Inventory);
});

const getInventories = catchAsync(async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const inventories = await inventoryService.getInventoryList({ filters });
  res.send(inventories);
});

const getInventory = catchAsync(async (req, res) => {
  const inventory = await inventoryService.getInventoryDetail(req.params.id);
  res.send(inventory);
});

const updateInventory = catchAsync(async (req, res) => {
  await inventoryService.updateInventory(req.params.id, req.body);
  res.send('Update inventory successfully');
});

const deleteInventory = catchAsync(async (req, res) => {
  await inventoryService.deleteInventory(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInventory,
  getInventories,
  getInventory,
  updateInventory,
  deleteInventory,
};
