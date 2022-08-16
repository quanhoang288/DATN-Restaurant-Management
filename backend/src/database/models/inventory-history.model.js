const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class InventoryHistory extends Model {
    static associate(models) {
      models.InventoryHistory.hasMany(models.InventoryHistoryItem, {
        as: 'items',
        foreignKey: 'inventory_history_id',
      });
      models.InventoryHistory.belongsTo(models.Inventory, {
        as: 'sourceInventory',
        foreignKey: 'source_inventory_id',
      });
      models.InventoryHistory.belongsTo(models.Inventory, {
        as: 'targetInventory',
        foreignKey: 'target_inventory_id',
      });
      models.InventoryHistory.belongsTo(models.Kitchen, {
        as: 'kitchen',
        foreignKey: 'kitchen_id',
      });
    }
  }

  InventoryHistory.init(
    {
      ...id(DataTypes),
      source_inventory_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'inventories',
        },
      },
      target_inventory_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'inventories',
        },
        allowNull: false,
      },
      kitchen_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'kitchens',
        },
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'provider',
      },
      provider: {
        type: DataTypes.STRING,
      },
      import_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
      },
      discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
