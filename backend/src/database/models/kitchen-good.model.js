const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class KitchenGood extends Model {
    static associate(models) {
      models.KitchenGood.belongsTo(models.Kitchen, {
        as: 'kitchen',
        foreignKey: 'kitchen_id',
      });
      models.KitchenGood.belongsTo(models.Good, {
        as: 'good',
        foreignKey: 'good_id',
      });
      models.KitchenGood.belongsTo(models.Unit, {
        as: 'unit',
        foreignKey: 'unit_id',
      });
    }
  }

  KitchenGood.init(
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
      kitchen_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'kitchens',
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
      modelName: 'KitchenGood',
      tableName: 'good_inventory',
    },
  );
  return KitchenGood;
};
