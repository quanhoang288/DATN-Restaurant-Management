const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class OrderDiscount extends Model {
    static associate(models) {
      models.OrderDiscount.belongsTo(models.Order, {
        as: 'order',
        foreignKey: 'order_id',
      });

      models.OrderDiscount.belongsTo(models.DiscountConstraint, {
        as: 'discountConstraint',
        foreignKey: 'discount_constraint_id',
      });
      models.OrderDiscount.hasMany(models.OrderDiscountGood, {
        as: 'discountGoods',
        foreignKey: 'order_discount_id',
      });
      models.OrderDiscount.belongsToMany(models.Good, {
        as: 'discountItems',
        through: {
          model: models.OrderDiscountGood,
        },
        foreignKey: 'order_discount_id',
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
        allowNull: false,
      },
      discount_constraint_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'discount_constraints',
        },
        allowNull: false,
      },
      // good_id: {
      //   type: DataTypes.BIGINT.UNSIGNED,
      //   references: {
      //     model: 'goods',
      //   },
      // },
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
