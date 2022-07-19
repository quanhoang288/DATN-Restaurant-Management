const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class DiscountConstraintGood extends Model {
    static associate(models) {
      models.DiscountConstraintGood.belongsTo(models.DiscountConstraint, {
        as: 'constraint',
        foreignKey: 'discount_constraint_id',
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
      discount_constraint_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'discount_constraints',
          key: 'discount_constraint_id',
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
      is_discount_item: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'DiscountConstraintGood',
      tableName: 'discount_constraint_goods',
    },
  );
  return DiscountConstraintGood;
};
