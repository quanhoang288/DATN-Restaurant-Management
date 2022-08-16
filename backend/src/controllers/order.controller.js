const httpStatus = require('http-status');
const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  return res.status(httpStatus.OK).send(order);
});

const getOrderList = async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const result = await orderService.getOrderList({ ...req.query, filters });
  res.send(result);
};

const getOrderDetail = catchAsync(async (req, res) => {
  const order = await orderService.getOrderDetail(req.params.id);
  res.send(order);
});

const updateOrder = catchAsync(async (req, res) => {
  await orderService.updateOrder(req.params.id, req.body);
  return res.status(httpStatus.OK).json({
    message: 'Update order succesfully',
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrder(req.params.id);
  res.status(httpStatus.NO_CONTENT).json({
    message: 'Delete order succesfully',
  });
});

const payOrder = catchAsync(async (req, res) => {
  await orderService.payOrder(req.params.id, req.body);
  return res.status(httpStatus.OK).json({
    message: 'Pay order successfully',
  });
});

const updateOrderItem = catchAsync(async (req, res) => {
  await orderService.updateOrderItem(req.params.itemId, req.body);
  return res
    .status(httpStatus.OK)
    .json({ message: 'Update item successfully' });
});

const getKitchenOrderItems = catchAsync(async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const items = await orderService.getKitchenOrderItems(
    filters.branch_id || null,
    filters.status,
  );
  return res.send(items);
});

const bulkUpdateKitchenItems = catchAsync(async (req, res) => {
  const { itemId, status } = req.body;
  await orderService.bulkUpdateItems(itemId, status);
  return res
    .status(httpStatus.OK)
    .json({ message: 'Bulk update kitchen items successfully' });
});

module.exports = {
  createOrder,
  getOrderList,
  getOrderDetail,
  updateOrder,
  deleteOrder,
  payOrder,
  updateOrderItem,
  getKitchenOrderItems,
  bulkUpdateKitchenItems,
};
