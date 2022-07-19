const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class NotificationTemplate extends Model {
    static associate(models) {
      models.NotificationTemplate.hasMany(models.Notification, {
        as: 'notifications',
        foreignKey: 'notification_template_id',
      });
    }
  }

  NotificationTemplate.init(
    {
      ...id(DataTypes),
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'NotificationTemplate',
      tableName: 'notification_templates',
    },
  );
  return NotificationTemplate;
};
