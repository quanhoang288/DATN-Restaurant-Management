const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotification(req.body);
  return res.status(httpStatus.CREATED).send(notification);
});

const getNotifications = catchAsync(async (req, res) => {
  const result = await notificationService.getNotifications(req.query);
  return res.send(result);
});

const updateNotificationReadStatus = catchAsync(async (req, res) => {
  const notificationId = req.params.id;
  const { userId } = req.body;

  await notificationService.markNotificationAsRead(notificationId, userId);

  res.send('Update notification successfully');
});

module.exports = {
  createNotification,
  getNotifications,
  updateNotificationReadStatus,
};
