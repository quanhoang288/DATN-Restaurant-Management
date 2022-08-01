const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    static associate(models) {}
  }

  Unit.init(
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
      modelName: 'Unit',
      tableName: 'units',
    },
  );
  return Unit;
};
