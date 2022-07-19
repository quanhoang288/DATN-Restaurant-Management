const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { discountService } = require('../services');

const createDiscount = catchAsync(async (req, res) => {
  await discountService.createDiscount(req.body);
  return res.status(httpStatus.CREATED).json({
    message: 'Create discount successfully',
  });
});

const getDiscounts = catchAsync(async (req, res) => {
  const { orderId } = req.query;
  const discounts = orderId
    ? await discountService.getAvailableDiscounts(orderId)
    : await discountService.getDiscounts();
  return res.send(discounts);
});

const getDiscount = catchAsync(async (req, res) => {
  const { id } = req.params;
  const discount = await discountService.getDiscount(id);
  return res.status(httpStatus.OK).send(discount);
});

const updateDiscount = catchAsync(async (req, res) => {
  const { id } = req.params;
  await discountService.updateDiscount(id, req.body);
  return res
    .status(httpStatus.OK)
    .json({ message: 'Update discount successfully' });
});

const deleteDiscount = catchAsync(async (req, res) => {
  const { id } = req.params;
  await discountService.deleteDiscount(id);
  return res
    .status(httpStatus.NO_CONTENT)
    .json({ message: 'Delete discount succesfully' });
});

module.exports = {
  createDiscount,
  getDiscounts,
  getDiscount,
  updateDiscount,
  deleteDiscount,
};
