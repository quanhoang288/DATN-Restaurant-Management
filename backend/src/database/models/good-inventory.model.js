const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class GoodInventory extends Model {
    static associate(models) {
      models.GoodInventory.belongsTo(models.Inventory, {
        as: 'inventory',
        foreignKey: 'inventory_id',
      });
      models.GoodInventory.belongsTo(models.Good, {
        as: 'good',
        foreignKey: 'good_id',
      });
      models.GoodInventory.belongsTo(models.Unit, {
        as: 'unit',
        foreignKey: 'unit_id',
      });
    }
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
      inventory_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'inventories',
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
