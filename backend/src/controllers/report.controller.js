const catchAsync = require('../utils/catchAsync');
const { reportService } = require('../services');

const getCurDateReport = catchAsync(async (req, res) => {
  const stats = await reportService.getCurDateStatistics(req.query.curDate);
  return res.send(stats);
});

const getMonthRevenueReport = catchAsync(async (req, res) => {
  const { type, groupBy } = req.query;
  const stats = await reportService.getMonthRevenueStatistics(type, groupBy);
  console.log('monthy revenue stats', stats);
  return res.send(stats);
});

const getMonthCustomerReport = catchAsync(async (req, res) => {
  const { type, groupBy } = req.query;
  const stats = await reportService.getMonthCustomerQuantity(type, groupBy);
  console.log('monthy customer stats', stats);

  return res.send(stats);
});

const getFavoriteItems = catchAsync(async (req, res) => {
  const { type, limit } = req.query;
  const items = await reportService.getFavoriteItems(new Date(), type, limit);
  return res.send(items);
});

module.exports = {
  getCurDateReport,
  getMonthCustomerReport,
  getMonthRevenueReport,
  getFavoriteItems,
};
