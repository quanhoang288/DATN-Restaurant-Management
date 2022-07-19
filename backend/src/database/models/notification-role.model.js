const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class NotificationRole extends Model {
    static associate(models) {
      models.NotificationRole.belongsTo(models.Notification, {
        as: 'notification',
        foreignKey: 'notification_id',
      });
      models.NotificationRole.belongsTo(models.Role, {
        as: 'role',
        foreignKey: 'role_id',
      });
    }
  }

  NotificationRole.init(
    {
      ...id(DataTypes),
      notification_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'notifications',
        },
      },
      role_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'roles',
        },
      },
    },
    {
      sequelize,
      modelName: 'NotificationRole',
      tableName: 'notification_role',
    },
  );
  return NotificationRole;
};
