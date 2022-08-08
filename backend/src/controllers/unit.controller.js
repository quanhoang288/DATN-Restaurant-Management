const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { unitService } = require('../services');

const createUnit = catchAsync(async (req, res) => {
  const role = await unitService.createUnit(req.body);
  res.status(httpStatus.CREATED).send(role);
});

const getUnits = catchAsync(async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const result = await unitService.getUnits({ filters });
  res.send(result);
});

module.exports = {
  createUnit,
  getUnits,
};
