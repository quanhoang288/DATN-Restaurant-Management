const express = require('express');
// const validate = require('../../middlewares/validate');
// const auth = require('../../middlewares/auth');
const invoiceController = require('../../controllers/invoice.controller');

const router = express.Router();

router.route('/').post(
  // auth,
  invoiceController.createInvoice,
);

router.get('/:id', invoiceController.getInvoice);

module.exports = router;
