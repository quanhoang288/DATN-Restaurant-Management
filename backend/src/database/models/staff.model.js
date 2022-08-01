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
      is_admin: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
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
