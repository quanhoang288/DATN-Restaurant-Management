const httpStatus = require('http-status');
const db = require('../database/models');
const query = require('../utils/query');

const ApiError = require('../exceptions/api-error');
const { NotificationType } = require('../constants');

const { Op } = db.Sequelize;

const createNotification = async (data, option = {}) => {
  const { type } = data;

  const t = await db.sequelize.transaction();
  option.transaction = t;
  let notificationId = null;

  let roles = [];

  if (type === NotificationType.ORDER_CREATED.type) {
    roles = await db.Role.findAll({
      where: {
        code: {
          [Op.in]: ['shipper', 'cashier', 'server'],
        },
      },
      attributes: ['id'],
    });
  }

  try {
    console.log('data: ', data);
    const notification = await db.Notification.create(data, option);

    console.log(notification);

    if (roles.length > 0) {
      await db.NotificationRole.bulkCreate(
        roles.map((role) => ({
          notification_id: notification.id,
          role_id: role.id,
        })),
        option,
      );
    }
    await t.commit();
    notificationId = notification.id;
  } catch (error) {
    console.log(error);
    t.rollback();
    throw error;
  }

  if (notificationId) {
    const createdNotification = db.Notification.findByPk(notificationId, {
      include: [
        {
          association: 'roles',
        },
        // {
        //   association: 'customer',
        // },
      ],
    });
    return createdNotification;
  }

  throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
};

const getNotifications = async (params = {}) => {
  const filters = params.filters || {};
  const sort = params.sort || [];
  const include = [];

  const userId = params.user_id;
  const user = await db.User.findByPk(userId, {
    include: [
      { association: 'customer' },
      { association: 'staff', include: [{ association: 'role' }] },
    ],
  });

  if (user.staff) {
    const roleId = user.staff.role.id;
    include.push({
      association: 'roles',
      where: {
        id: roleId,
        required: true,
      },
    });
  } else {
    filters.customer_id = user.id;
  }

  // eslint-disable-next-line no-prototype-builtins
  if (params.hasOwnProperty('page')) {
    const items = await db.Notification.paginate({
      page: params.page,
      perPage: params.perPage || 10,
      where: query.filter(Op, filters),
      order: sort,
      include,
    });

    return query.getPagingData(items, params.page, params.perPage);
  }

  const option = {
    where: filters,
    sort,
    include,
  };

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
