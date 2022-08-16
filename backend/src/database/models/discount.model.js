const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      models.Discount.hasMany(models.DiscountConstraint, {
        as: 'constraints',
        foreignKey: 'discount_id',
      });
      models.Discount.hasMany(models.DiscountTimeSlot, {
        as: 'timeSlots',
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
      image: {
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
      method: {
        type: DataTypes.STRING,
      },
      is_auto_applied: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
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
