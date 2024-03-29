const httpStatus = require('http-status');
const invoiceService = require('../services/invoice.service');
const catchAsync = require('../utils/catchAsync');

const createInvoice = catchAsync(async (req, res) => {
  await invoiceService.createInvoice(req.body);
  return res.status(httpStatus.OK).json({
    message: 'Create invoice succesfully',
  });
});

const getInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.getInvoice(req.params.id);
  return res.send(invoice);
});

module.exports = {
  createInvoice,
  getInvoice,
};
