const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { inventoryHistoryService } = require('../services');

const createInventoryHistory = catchAsync(async (req, res) => {
  const inventoryHistory = await inventoryHistoryService.createInventoryHistory(
    req.body,
  );
  res.status(httpStatus.CREATED).send(inventoryHistory);
});

const getInventoryHistories = catchAsync(async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const inventoryHistories =
    await inventoryHistoryService.getInventoryHistoryList({
      ...req.query,
      filters,
    });
  res.send(inventoryHistories);
});

const getInventoryHistory = catchAsync(async (req, res) => {
  const inventoryHistory = await inventoryHistoryService.getInventoryHistory(
    req.params.id,
  );
  res.send(inventoryHistory);
});

const updateInventoryHistory = catchAsync(async (req, res) => {
  await inventoryHistoryService.updateInventoryHistory(req.params.id, req.body);
  res.send('Update inventory history successfully');
});

const deleteInventoryHistory = catchAsync(async (req, res) => {
  await inventoryHistoryService.deleteInventoryHistory(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInventoryHistory,
  getInventoryHistories,
  getInventoryHistory,
  updateInventoryHistory,
  deleteInventoryHistory,
};
