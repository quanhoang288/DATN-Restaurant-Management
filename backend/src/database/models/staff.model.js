const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    static associate(models) {
      models.Staff.belongsTo(models.User, { as: 'user', foreignKey: 'id' });
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
      timestamps: false,
    },
  );
  return Staff;
};
