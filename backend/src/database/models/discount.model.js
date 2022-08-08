const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      models.Discount.hasMany(models.DiscountConstraint, {
        as: 'constraints',
        foreignKey: 'discount_id',
      });
    }
  }

  Discount.init(
    {
      ...id(DataTypes),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
      },
      start_day: {
        type: DataTypes.INTEGER,
      },
      end_day: {
        type: DataTypes.INTEGER,
      },
      start_hour: {
        type: DataTypes.DATE,
      },
      end_hour: {
        type: DataTypes.DATE,
      },
      method: {
        type: DataTypes.STRING,
      },
      is_applied_to_all_customers: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      is_auto_applied: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Discount',
      tableName: 'discounts',
    },
  );
  return Discount;
};
