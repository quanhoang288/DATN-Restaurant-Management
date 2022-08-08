const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    static associate(models) {
      models.Staff.belongsTo(models.User, { as: 'user', foreignKey: 'id' });
      models.Staff.belongsTo(models.Role, {
        as: 'role',
        foreignKey: 'role_id',
      });
    }
  }

  Staff.init(
    {
      branch_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'branches',
        },
      },
      role_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'roles',
        },
      },
    },
    {
      sequelize,
      modelName: 'Staff',
      tableName: 'staff',
      timestamps: false,
    },
  );
  return Staff;
};
