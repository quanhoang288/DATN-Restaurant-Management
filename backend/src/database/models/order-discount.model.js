const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class OrderDiscount extends Model {
    static associate(models) {
      models.OrderDiscount.belongsTo(models.Order, {
        as: 'order',
        foreignKey: 'order_id',
      });

      models.OrderDiscount.belongsTo(models.Discount, {
        as: 'discount',
        foreignKey: 'discount_id',
      });
    }
  }

  OrderDiscount.init(
    {
      ...id(DataTypes),
      order_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'orders',
        },
      },
      discount_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'discounts',
        },
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'OrderDiscount',
      tableName: 'order_discounts',
    },
  );
  return OrderDiscount;
};
