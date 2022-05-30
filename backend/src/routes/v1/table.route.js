const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const tableValidation = require('../../validations/table.validation');
const tableController = require('../../controllers/table.controller');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    validate(tableValidation.createTable),
    tableController.createTable,
  )
  .get(validate(tableValidation.getTables), tableController.getTables);

router
  .route('/:id')
  .get(validate(tableValidation.getTable), tableController.getTable)
  .put(validate(tableValidation.updateTable), tableController.updateTable)
  .delete(
    // auth,
    validate(tableValidation.deleteTable),
    tableController.deleteTable,
  );

module.exports = router;
