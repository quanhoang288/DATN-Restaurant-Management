const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {}
  }

  Role.init(
    {
      ...id(DataTypes),

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
    },
  );
  return Role;
};
