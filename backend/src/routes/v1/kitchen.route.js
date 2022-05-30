const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const kitchenValidation = require('../../validations/kitchen.validation');
const kitchenController = require('../../controllers/kitchen.controller');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    validate(kitchenValidation.createKitchen),
    kitchenController.createKitchen,
  )
  .get(
    // auth,
    validate(kitchenValidation.getKitchens),
    kitchenController.getKitchens,
  );

router
  .route('/:id')
  .get(
    // auth,
    validate(kitchenValidation.getKitchen),
    kitchenController.getKitchen,
  )
  .put(
    // auth,
    validate(kitchenValidation.updateKitchen),
    kitchenController.updateKitchen,
  )
  .delete(
    // auth,
    validate(kitchenValidation.deleteKitchen),
    kitchenController.deleteKitchen,
  );

module.exports = router;
