const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class GoodInventory extends Model {
    static associate(models) {}
  }

  GoodInventory.init(
    {
      ...id(DataTypes),
      good_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'goods',
        },
        allowNull: false,
      },
      unit_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'units',
        },
        allowNull: false,
      },
      branch_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'branches',
        },
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'GoodInventory',
      tableName: 'good_inventory',
    },
  );
  return GoodInventory;
};
