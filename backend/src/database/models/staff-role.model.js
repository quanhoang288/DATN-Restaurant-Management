const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class StaffRole extends Model {
    static associate(models) {
      models.StaffRole.belongsTo(models.Order, {
        as: 'order',
        foreignKey: 'customer_id',
      });

      models.StaffRole.belongsTo(models.Good, {
        as: 'good',
        foreignKey: 'good_id',
      });
    }
  }

  StaffRole.init(
    {
      ...id(DataTypes),
      staff_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'staff',
          key: 'staff_id',
        },
      },
      role_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'roles',
          key: 'role_id',
        },
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'StaffRole',
      tableName: 'staff_roles',
    },
  );
  return StaffRole;
};
