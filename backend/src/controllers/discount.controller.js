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
  // TODO
});

const getDiscount = catchAsync(async (req, res) => {
  const { id } = req.params;
  return res.status(httpStatus.OK).json(discountService.getStaff(id));
});

const updateDiscount = catchAsync(async (req, res) => {
  const { id } = req.params;
  return res
    .status(httpStatus.OK)
    .json(discountService.updateDiscount(id, req.body));
});

const deleteDiscount = catchAsync(async (req, res) => {
  const { id } = req.params;
  return res
    .status(httpStatus.NO_CONTENT)
    .json(discountService.deleteDiscount(id));
});

module.exports = {
  createDiscount,
  getDiscounts,
  getDiscount,
  updateDiscount,
  deleteDiscount,
};
