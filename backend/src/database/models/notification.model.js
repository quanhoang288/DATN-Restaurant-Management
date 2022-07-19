const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      models.Notification.belongsTo(models.NotificationTemplate, {
        as: 'template',
        foreignKey: 'notification_template_id',
      });
      models.Notification.belongsToMany(models.User, {
        as: 'users',
        foreignKey: 'notification_id',
        through: {
          model: models.NotificationUser,
        },
      });
      models.Notification.belongsToMany(models.Role, {
        as: 'roles',
        foreignKey: 'notification_id',
        through: {
          model: models.NotificationRole,
        },
      });
    }
  }

  Notification.init(
    {
      ...id(DataTypes),
      notification_template_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'notification_templates',
        },
      },
      referenced_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
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
