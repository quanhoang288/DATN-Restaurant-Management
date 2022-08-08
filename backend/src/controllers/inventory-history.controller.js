const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { inventoryService } = require('../services');

const createInventoryHistory = catchAsync(async (req, res) => {
  const inventoryHistory = await inventoryService.createInventory(req.body);
  res.status(httpStatus.CREATED).send(inventoryHistory);
});

const getInventoryHistories = catchAsync(async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const inventoryHistories = await inventoryService.getInventoryList({
    filters,
  });
  res.send(inventoryHistories);
});

const getInventoryHistory = catchAsync(async (req, res) => {
  const inventoryHistory = await inventoryService.getInventoryDetail(
    req.params.id,
  );
  res.send(inventoryHistory);
});

const updateInventoryHistory = catchAsync(async (req, res) => {
  await inventoryService.updateInventory(req.params.id, req.body);
  res.send('Update inventory history successfully');
});

const deleteInventoryHistory = catchAsync(async (req, res) => {
  await inventoryService.deleteInventory(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInventoryHistory,
  getInventoryHistories,
  getInventoryHistory,
  updateInventoryHistory,
  deleteInventoryHistory,
};
