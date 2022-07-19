const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class KitchenOrder extends Model {
    static associate(models) {
      models.KitchenOrder.belongsTo(models.Kitchen, {
        as: 'kitchen',
        foreignKey: 'kitchen_id',
      });
      models.KitchenOrder.belongsTo(models.Order, {
        as: 'order',
        foreignKey: 'order_id',
      });
    }
  }

  KitchenOrder.init(
    {
      ...id(DataTypes),
      kitchen_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'kitchens',
        },
      },
      order_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'orders',
        },
      },
    },
    {
      sequelize,
      modelName: 'KitchenOrder',
      tableName: 'kitchen_order',
    },
  );
  return KitchenOrder;
};
