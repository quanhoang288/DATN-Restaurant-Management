const express = require('express');
const validate = require('../../middlewares/validate');
// const auth = require('../../middlewares/auth');
const customerController = require('../../controllers/customer.controller');
const customerValidation = require('../../validations/customer.validation');

const router = express.Router();

router
  .route('/')

  .get(
    // auth(),
    validate(customerValidation.getCustomers),
    customerController.getCustomers,
  );

router.route('/:id').get(
  // auth,
  customerController.getCustomer,
);

module.exports = router;
