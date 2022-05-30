const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    static associate(models) {}
  }

  Table.init(
    {
      ...id(DataTypes),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      floor_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Table',
      tableName: 'tables',
    },
  );
  return Table;
};
