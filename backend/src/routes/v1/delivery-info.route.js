const express = require('express');
// const auth = require('../../middlewares/auth');
const deliveryInfoController = require('../../controllers/delivery-info.controller');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    deliveryInfoController.createDeliveryInfo,
  )
  .get(
    // auth,
    deliveryInfoController.getDeliveryInfos,
  );

router
  .route('/:id')
  .get(
    // auth,
    deliveryInfoController.getDeliveryInfo,
  )
  .put(
    // auth,
    deliveryInfoController.updateDeliveryInfo,
  )
  .delete(
    // auth,
    deliveryInfoController.deleteDeliveryInfo,
  );

module.exports = router;
