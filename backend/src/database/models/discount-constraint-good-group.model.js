const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class DiscountConstraintGoodGroup extends Model {
    static associate(models) {
      models.DiscountConstraintGoodGroup.belongsTo(models.Discount, {
        as: 'discount',
        foreignKey: 'discount_id',
      });
      models.DiscountConstraintGoodGroup.belongsTo(models.GoodGroup, {
        as: 'good_group',
        foreignKey: 'good_group_id',
      });
    }
  }

  DiscountConstraintGoodGroup.init(
    {
      ...id(DataTypes),
      discount_constraint_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'discount_constraints',
          key: 'id',
        },
      },
      good_group_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'good_groups',
          key: 'id',
        },
      },
      is_discount_item: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'DiscountConstraintGoodGroup',
      tableName: 'discount_constraint_good_groups',
    },
  );
  return DiscountConstraintGoodGroup;
};
