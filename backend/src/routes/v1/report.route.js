const express = require('express');
const reportController = require('../../controllers/report.controller');

const router = express.Router();

router.get('/today-report', reportController.getCurDateReport);
router.get('/monthly-revenue-report', reportController.getMonthRevenueReport);
router.get('/monthly-customer-report', reportController.getMonthCustomerReport);
router.get('/favorite-items', reportController.getFavoriteItems);

module.exports = router;
