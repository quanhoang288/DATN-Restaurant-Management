const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    static associate(models) {
      models.Staff.belongsTo(models.User, { as: 'staff', foreignKey: 'id' });
      models.Staff.belongsToMany(models.Role, {
        as: 'roles',
        through: {
          model: models.StaffRole,
        },
        key: 'role_id',
      });
    }
  }

  Staff.init(
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Staff',
      tableName: 'staff',
    },
  );
  return Staff;
};
