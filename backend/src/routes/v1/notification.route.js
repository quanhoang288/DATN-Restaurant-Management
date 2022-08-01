const express = require('express');
// const validate = require('../../middlewares/validate');
// const auth = require('../../middlewares/auth');
const notificationController = require('../../controllers/notification.controller');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    notificationController.createNotification,
  )
  .get(
    // auth,
    notificationController.getNotifications,
  );

router.route('/:id').put(notificationController.updateNotificationReadStatus);

module.exports = router;
