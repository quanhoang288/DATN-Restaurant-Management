const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class DiscountTimeRange extends Model {
    static associate(models) {}
  }

  DiscountTimeRange.init(
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
      },
      end_time: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'DiscountTimeRange',
      tableName: 'discount_time_ranges',
    },
  );
  return DiscountTimeRange;
};
