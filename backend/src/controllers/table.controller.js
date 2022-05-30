const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../exceptions/api-error');
const catchAsync = require('../utils/catchAsync');
const { tableService } = require('../services');

const createTable = catchAsync(async (req, res) => {
  const table = await tableService.createTable(req.body);
  res.status(httpStatus.CREATED).json({
    data: table,
  });
});

const getTables = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await tableService.getTableList(filter, options);
  res.send(result);
});

const getTable = catchAsync(async (req, res) => {
  const table = await tableService.getTableDetail(req.params.id);
  if (!table) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Table not found');
  }
  res.send(table);
});

const updateTable = catchAsync(async (req, res) => {
  const table = await tableService.updateTable(req.params.id, req.body);
  res.send(table);
});

const deleteTable = catchAsync(async (req, res) => {
  await tableService.deleteTable(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTable,
  getTables,
  getTable,
  updateTable,
  deleteTable,
};
