const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router.get('/reports/month-revenue', orderController.getMonthRevenueStatistics);

router
  .route('/')
  .post(
    // auth,
    validate(orderValidation.createOrder),
    orderController.createOrder,
  )
  .get(
    // auth,
    validate(orderValidation.getOrders),
    orderController.getOrderList,
  );

router.post('/:id/payment', orderController.payOrder);
router.post('/:id/items/:itemId/update', orderController.updateOrderItem);

router
  .route('/:id')
  .get(
    // auth,
    validate(orderValidation.getOrder),
    orderController.getOrderDetail,
  )
  .put(
    // auth,
    validate(orderValidation.updateOrder),
    orderController.updateOrder,
  )
  .delete(
    // auth,
    validate(orderValidation.deleteOrder),
    orderController.deleteOrder,
  );

module.exports = router;
