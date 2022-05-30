const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class DiscountConstraintGood extends Model {
    static associate(models) {
      models.DiscountConstraintGood.belongsTo(models.Discount, {
        as: 'discount',
        foreignKey: 'discount_id',
      });
      models.DiscountConstraintGood.belongsTo(models.Good, {
        as: 'good',
        foreignKey: 'good_id',
      });
    }
  }

  DiscountConstraintGood.init(
    {
      ...id(DataTypes),
      discount_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'discounts',
          key: 'discount_id',
        },
      },
      good_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'goods',
          key: 'good_id',
        },
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'DiscountConstraintGood',
      tableName: 'discount_constraint_goods',
    },
  );
  return DiscountConstraintGood;
};
