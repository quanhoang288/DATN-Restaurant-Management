const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class NotificationUser extends Model {
    static associate(models) {
      models.NotificationUser.belongsTo(models.Notification, {
        as: 'notification',
        foreignKey: 'notification_id',
      });
      models.NotificationUser.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id',
      });
    }
  }

  NotificationUser.init(
    {
      ...id(DataTypes),
      notification_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'notifications',
        },
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
        },
      },
      read_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'NotificationUser',
      tableName: 'notification_user',
    },
  );
  return NotificationUser;
};
