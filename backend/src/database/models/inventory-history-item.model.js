const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class InventoryHistoryItem extends Model {
    static associate(models) {}
  }

  InventoryHistoryItem.init(
    {
      ...id(DataTypes),
      inventory_history_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'inventory_histories',
        },
        allowNull: false,
      },
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
      quantity: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'InventoryHistoryItem',
      tableName: 'inventory_history_items',
    },
  );
  return InventoryHistoryItem;
};
