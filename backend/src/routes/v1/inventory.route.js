const express = require('express');
const validate = require('../../middlewares/validate');
// const auth = require('../../middlewares/auth');
const inventoryController = require('../../controllers/inventory.controller');
const { inventoryValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    inventoryController.createInventory,
  )
  .get(
    // auth,
    validate(inventoryValidation.getInventories),
    inventoryController.getInventories,
  );

router
  .route('/:id')
  .get(
    // auth,
    inventoryController.getInventory,
  )
  .put(
    // auth,
    inventoryController.updateInventory,
  )
  .delete(
    // auth,
    inventoryController.deleteInventory,
  );

module.exports = router;
