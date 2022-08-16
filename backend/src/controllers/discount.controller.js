const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { discountService } = require('../services');
const convertToNumber = require('../utils/numberConverter');

const createDiscount = catchAsync(async (req, res) => {
  const data = {
    ...req.body,
    constraints: JSON.parse(req.body.constraints).value,
    timeSlots: JSON.parse(req.body.timeSlots).value,
  };
  if (req.file) {
    data.image = req.file;
  }
  console.log('discount data: ', data);
  await discountService.createDiscount(convertToNumber(data, ['image']));
  res.status(httpStatus.CREATED).json({
    message: 'Create discount successfully',
  });
});

const getDiscounts = catchAsync(async (req, res) => {
  const { orderId } = req.query;
  const filters = JSON.parse(req.query.filters || '{}');
  const discounts = orderId
    ? await discountService.getAvailableDiscounts(orderId)
    : await discountService.getDiscounts({ ...req.query, filters });
  return res.send(discounts);
});

const getDiscount = catchAsync(async (req, res) => {
  const { id } = req.params;
  const discount = await discountService.getDiscount(id);
  return res.status(httpStatus.OK).send(discount);
});

const updateDiscount = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = {
    ...req.body,
    constraints: JSON.parse(req.body.constraints).value,
    timeSlots: JSON.parse(req.body.timeSlots).value,
  };
  if (req.file) {
    updateData.image = req.file;
  }
  await discountService.updateDiscount(id, updateData);
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
