const httpStatus = require('http-status');
const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res) => {
  await orderService.createOrder(req.body);
  return res.status(httpStatus.OK).json({
    message: 'Create order succesfully',
  });
});

const getOrderList = async (req, res) => {};

const getOrderDetail = async (req, res) => {};

const updateOrder = async (req, res) => {};

const deleteOrder = async (req, res) => {};

module.exports = {
  createOrder,
  getOrderList,
  getOrderDetail,
  updateOrder,
  deleteOrder,
};
