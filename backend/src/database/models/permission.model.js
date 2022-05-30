const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {}
  }

  Permission.init(
    {
      ...id(DataTypes),
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'permissions',
    },
  );
  return Permission;
};
