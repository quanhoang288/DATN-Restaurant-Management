const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class DiscountCustomerGroup extends Model {
    static associate(models) {
      models.DiscountCustomerGroup.belongsTo(models.Group, {
        as: 'group',
        foreignKey: 'customer_group_id',
      });
      models.DiscountCustomerGroup.belongsTo(models.Discount, {
        as: 'discount',
        foreignKey: 'discount_id',
      });
    }
  }

  DiscountCustomerGroup.init(
    {
      ...id(DataTypes),
      discount_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'discounts',
        },
      },
      customer_group_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'groups',
          key: 'customer_group_id',
        },
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'DiscountCustomerGroup',
      tableName: 'discount_customer_groups',
    },
  );
  return DiscountCustomerGroup;
};
