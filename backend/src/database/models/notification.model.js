const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      models.Notification.belongsToMany(models.User, {
        as: 'users',
        foreignKey: 'notification_id',
        through: {
          model: models.NotificationUser,
        },
      });
      models.Notification.belongsTo(models.Order, {
        as: 'order',
        foreignKey: 'order_id',
      });
      models.Notification.belongsTo(models.OrderDetail, {
        as: 'orderItem',
        foreignKey: 'order_item_id',
      });
      models.Notification.belongsTo(models.Reservation, {
        as: 'reservation',
        foreignKey: 'reservation_id',
      });
    }
  }

  Notification.init(
    {
      ...id(DataTypes),
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      order_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'orders',
        },
      },
      order_item_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'order_details',
        },
      },
      reservation_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'reservations',
        },
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'notifications',
    },
  );
  return Notification;
};
