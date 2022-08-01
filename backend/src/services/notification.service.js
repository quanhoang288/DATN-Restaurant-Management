const db = require('../database/models');
const query = require('../utils/query');

const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');

const { Op } = db;

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

const getNotifications = async (params = {}) => {
  const filter = params.filter || {};
  const sort = params.sort || [];

  // eslint-disable-next-line no-prototype-builtins
  if (params.hasOwnProperty('page')) {
    const items = await db.Notification.paginate(
      {
        page: params.page,
        perPage: params.perPage,
      },
      {
        where: query.filter(Op, filter),
        order: sort,
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
      },
    );

    return query.getPagingData(items, params.page, params.perPage);
  }

  const option = {
    where: filter,
    sort,
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
  };
  if (params.attributes) {
    option.attributes = params.attributes;
  }

  return db.Notification.findAll(option);
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
