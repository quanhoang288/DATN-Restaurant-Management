const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');

const createNotification = async (data, option = {}) => {
  const { type } = data;
  const notificationTemplate = await db.NotificationTemplate.findOne({
    where: {
      type,
    },
  });
  if (!notificationTemplate) {
    const { statusCode, message } = Errors.InvalidNotificationType;
    throw new ApiError(statusCode, message);
  }
  data.notification_template_id = notificationTemplate.id;
  const roleIds = data.roles || [];
  const userId = data.user_id || null;
  delete data.roles;
  delete data.user_id;

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    const notification = await db.Notification.create(data, option);

    if (roleIds.length > 0) {
      await db.NotificationRole.bulkCreate(
        roleIds.map((roleId) => ({
          notification_id: notification.id,
          role_id: roleId,
        })),
        option,
      );
    } else if (userId) {
      await db.NotificationUser.create(
        { notification_id: notification.id, user_id: userId },
        option,
      );
    }
    await t.commit();
    return notification;
  } catch (error) {
    t.rollback();
    throw error;
  }
};

const getNotifications = async (filter = {}) => {
  console.log('filter: ', filter);
  return db.Notification.findAll({
    where: filter,
    include: [
      {
        association: 'template',
      },
      {
        association: 'users',
        attributes: ['id'],
        through: {
          attributes: [],
        },
      },
      {
        association: 'roles',
        attributes: ['id'],
        through: {
          attributes: [],
        },
      },
    ],
  });
};

const markNotificationAsRead = async (notificationId, userId, option = {}) => {
  const notification = await db.Notification.findByPk(notificationId, {
    include: [
      {
        association: 'users',
      },
    ],
  });
  if (notification) {
    const user = notification.users.find((u) => u.id === userId);
    if (user) {
      const now = new Date();
      await db.NotificationUser.update(
        { read_at: now },
        {
          where: {
            notification_id: notification.id,
            user_id: user.id,
          },
          ...option,
        },
      );
    }
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markNotificationAsRead,
};
