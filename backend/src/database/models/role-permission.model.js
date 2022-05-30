const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      models.RolePermission.belongsTo(models.Role, {
        as: 'role',
        foreignKey: 'role_id',
      });

      models.RolePermission.belongsTo(models.Permission, {
        as: 'permission',
        foreignKey: 'permission_id',
      });
    }
  }

  RolePermission.init(
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
      modelName: 'RolePermission',
      tableName: 'role_permission',
    },
  );
  return RolePermission;
};
