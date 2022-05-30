const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const discountValidation = require('../../validations/discount.validation');
const discountController = require('../../controllers/discount.controller');

const router = express.Router();

router
  .route('/')
  .post(
    // auth('manageUsers'),
    validate(discountValidation.createDiscount),
    discountController.createDiscount,
  )
  .get(
    // auth('getUsers'),
    validate(discountValidation.getDiscounts),
    discountController.getDiscounts,
  );

router
  .route('/:id')
  .get(
    // auth('getUsers'),
    validate(discountValidation.getDiscount),
    discountController.getDiscount,
  )
  .put(
    // auth('manageUsers'),
    validate(discountValidation.updateDiscount),
    discountController.updateDiscount,
  )
  .delete(
    // auth('manageUsers'),
    validate(discountValidation.deleteDiscount),
    discountController.deleteDiscount,
  );

module.exports = router;
