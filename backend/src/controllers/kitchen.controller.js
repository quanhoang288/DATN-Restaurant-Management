const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { kitchenService } = require('../services');

const createKitchen = catchAsync(async (req, res) => {
  const kitchen = await kitchenService.createKitchen(req.body);
  res.status(httpStatus.CREATED).send(kitchen);
});

const getKitchens = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await kitchenService.getKitchenList(filter, options);
  res.send(result);
});

const getKitchen = catchAsync(async (req, res) => {
  const kitchen = await kitchenService.getKitchenDetail(req.params.id);
  res.send(kitchen);
});

const updateKitchen = catchAsync(async (req, res) => {
  const kitchen = await kitchenService.updateKitchen(req.params.id, req.body);
  res.send(kitchen);
});

const deleteKitchen = catchAsync(async (req, res) => {
  await kitchenService.deleteKitchen(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createKitchen,
  getKitchens,
  getKitchen,
  updateKitchen,
  deleteKitchen,
};
