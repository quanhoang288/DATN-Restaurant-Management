const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class DiscountConstraint extends Model {
    static associate(models) {
      models.DiscountConstraint.belongsTo(models.Discount, {
        as: 'discount',
        foreignKey: 'discount_id',
      });
      models.DiscountConstraint.belongsToMany(models.Good, {
        as: 'goods',
        through: {
          model: models.DiscountConstraintGood,
        },
        foreignKey: 'discount_constraint_id',
      });
      models.DiscountConstraint.belongsToMany(models.GoodGroup, {
        as: 'goodGroups',
        through: {
          model: models.DiscountConstraintGoodGroup,
        },
        foreignKey: 'discount_constraint_id',
      });
      models.DiscountConstraint.hasMany(models.DiscountConstraintGood, {
        as: 'constraintGoods',
        foreignKey: 'discount_constraint_id',
      });
      models.DiscountConstraint.hasMany(models.DiscountConstraintGoodGroup, {
        as: 'constraintGoodGroups',
        foreignKey: 'discount_constraint_id',
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
      min_invoice_value: {
        type: DataTypes.INTEGER,
      },
      discount_amount: {
        type: DataTypes.INTEGER,
      },
      discount_unit: {
        type: DataTypes.STRING,
      },
      order_item_quantity: {
        type: DataTypes.INTEGER,
      },
      discount_item_quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'DiscountConstraint',
      tableName: 'discount_constraints',
    },
  );
  return DiscountConstraint;
};
