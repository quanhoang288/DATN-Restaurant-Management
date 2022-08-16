const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { customerService } = require('../services');

const getCustomers = catchAsync(async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const customers = await customerService.getCustomers({
    ...req.query,
    filters,
  });
  res.send(customers);
});

const getCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomer(req.params.id);
  res.send(customer);
});

module.exports = {
  getCustomers,
  getCustomer,
};
