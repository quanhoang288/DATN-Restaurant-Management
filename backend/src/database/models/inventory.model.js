const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      models.Inventory.belongsTo(models.Branch, {
        as: 'branch',
        foreignKey: 'branch_id',
      });
      models.Inventory.belongsToMany(models.Good, {
        as: 'goods',
        through: {
          model: models.GoodInventory,
        },
        foreignKey: 'inventory_id',
      });
      models.Inventory.hasMany(models.GoodInventory, {
        as: 'inventoryGoods',
        foreignKey: 'inventory_id',
      });
    }
  }

  Inventory.init(
    {
      ...id(DataTypes),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      branch_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'branches',
        },
        allowNull: false,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Inventory',
      tableName: 'inventories',
    },
  );
  return Inventory;
};
