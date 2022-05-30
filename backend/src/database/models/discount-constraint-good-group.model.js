const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class DiscountConstraintGoodGroup extends Model {
    static associate(models) {
      models.DiscountConstraintGoodGroup.belongsTo(models.Discount, {
        as: 'discount',
        foreignKey: 'discount_id',
      });
      models.DiscountConstraintGoodGroup.belongsTo(models.GoodGroup, {
        as: 'good_group',
        foreignKey: 'good_id',
      });
    }
  }

  DiscountConstraintGoodGroup.init(
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
          model: 'good_groups',
          key: 'good_group_id',
        },
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'DiscountConstraintGoodGroup',
      tableName: 'discount_constraint_good_groups',
    },
  );
  return DiscountConstraintGoodGroup;
};
