const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const staffValidation = require('../../validations/staff.validation');
const staffController = require('../../controllers/staff.controller');

const router = express.Router();

router
  .route('/')
  .post(
    // auth('manageUsers'),
    validate(staffValidation.createStaff),
    staffController.createStaff,
  )
  .get(
    // auth('getUsers'),
    validate(staffValidation.getStaffList),
    staffController.getStaffList,
  );

router
  .route('/:id')
  .get(
    // auth('getUsers'),
    validate(staffValidation.getStaff),
    staffController.getStaff,
  )
  .put(
    // auth('manageUsers'),
    validate(staffValidation.updateStaff),
    staffController.updateStaff,
  )
  .delete(
    // auth('manageUsers'),
    validate(staffValidation.deleteStaff),
    staffController.deleteStaff,
  );

module.exports = router;
