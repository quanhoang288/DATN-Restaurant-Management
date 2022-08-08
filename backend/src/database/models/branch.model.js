const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    static associate(models) {}
  }

  Branch.init(
    {
      ...id(DataTypes),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Branch',
      tableName: 'branches',
    },
  );
  return Branch;
};
