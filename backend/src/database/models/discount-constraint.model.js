const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class DiscountConstraint extends Model {
    static associate(models) {
      models.DiscountConstraint.belongsTo(models.Discount, {
        as: 'discount',
        foreignKey: 'discount_id',
      });
    }
  }

  DiscountConstraint.init(
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
      type: {
        type: DataTypes.STRING,
      },
      min_value: {
        type: DataTypes.INTEGER,
      },
      discount_method: {
        type: DataTypes.STRING,
      },
      discount_amount: {
        type: DataTypes.INTEGER,
      },
      discount_unit: {
        // % | VND
        type: DataTypes.INTEGER,
      },
      discount_item_quantity: {
        type: DataTypes.INTEGER,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'DiscountConstraint',
      tableName: 'discount_constraints',
    },
  );
  return DiscountConstraint;
};
