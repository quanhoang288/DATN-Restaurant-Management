const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { deliveryInfoService } = require('../services');

const createDeliveryInfo = catchAsync(async (req, res) => {
  const deliveryInfo = await deliveryInfoService.createDeliveryInfo(req.body);
  res.status(httpStatus.CREATED).send(deliveryInfo);
});

const getDeliveryInfos = catchAsync(async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const deliveryInfos = await deliveryInfoService.getDeliveryInfos({
    ...req.query,
    filters,
  });
  res.send(deliveryInfos);
});

const getDeliveryInfo = catchAsync(async (req, res) => {
  const deliveryInfo = await deliveryInfoService.getDeliveryInfo(req.params.id);
  res.send(deliveryInfo);
});

const updateDeliveryInfo = catchAsync(async (req, res) => {
  await deliveryInfoService.updateDeliveryInfo(req.params.id, req.body);
  res.send('Update delivery info successfully');
});

const deleteDeliveryInfo = catchAsync(async (req, res) => {
  await deliveryInfoService.deleteDeliveryInfo(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDeliveryInfo,
  getDeliveryInfos,
  getDeliveryInfo,
  updateDeliveryInfo,
  deleteDeliveryInfo,
};
