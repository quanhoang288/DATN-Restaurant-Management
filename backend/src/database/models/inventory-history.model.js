const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class InventoryHistory extends Model {
    static associate(models) {}
  }

  InventoryHistory.init(
    {
      ...id(DataTypes),
      inventory_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'inventories',
        },
        allowNull: false,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'InventoryHistory',
      tableName: 'inventory_histories',
    },
  );
  return InventoryHistory;
};
