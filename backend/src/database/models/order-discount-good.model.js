const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class OrderDiscountGood extends Model {
    static associate(models) {
      models.OrderDiscountGood.belongsTo(models.OrderDiscount, {
        as: 'orderDiscount',
        foreignKey: 'order_discount_id',
      });
      models.OrderDiscountGood.belongsTo(models.Good, {
        as: 'good',
        foreignKey: 'good_id',
      });
    }
  }

  OrderDiscountGood.init(
    {
      ...id(DataTypes),
      order_discount_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'order_discounts',
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
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'OrderDiscountGood',
      tableName: 'order_discount_goods',
    },
  );
  return OrderDiscountGood;
};
