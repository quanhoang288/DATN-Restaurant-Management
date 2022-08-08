const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class DiscountTimeSlot extends Model {
    static associate(models) {
      models.DiscountTimeSlot.belongsTo(models.Discount, {
        as: 'discount',
        foreignKey: 'discount_id',
      });
    }
  }

  DiscountTimeSlot.init(
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
      start_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'DiscountTimeSlot',
      tableName: 'discount_time_slots',
    },
  );
  return DiscountTimeSlot;
};
