const express = require('express');
const validate = require('../../middlewares/validate');
// const auth = require('../../middlewares/auth');
const inventoryHistoryController = require('../../controllers/inventory-history.controller');
const { inventoryHistoryValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    inventoryHistoryController.createInventoryHistory,
  )
  .get(
    // auth,
    validate(inventoryHistoryValidation.getInventoryHistories),

    inventoryHistoryController.getInventoryHistories,
  );

router
  .route('/:id')
  .get(
    // auth,
    inventoryHistoryController.getInventoryHistory,
  )
  .put(
    // auth,
    inventoryHistoryController.updateInventoryHistory,
  )
  .delete(
    // auth,
    inventoryHistoryController.deleteInventoryHistory,
  );

module.exports = router;
