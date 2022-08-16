const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    static associate(models) {}
  }

  Setting.init(
    {
      ...id(DataTypes),
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Setting',
      tableName: 'settings',
    },
  );
  return Setting;
};
