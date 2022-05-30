const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    static associate(models) {
      models.OrderDetail.belongsTo(models.Order, {
        as: 'order',
        foreignKey: 'order_id',
      });

      models.OrderDetail.belongsTo(models.Good, {
        as: 'good',
        foreignKey: 'good_id',
      });
    }
  }

  OrderDetail.init(
    {
      ...id(DataTypes),
      order_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'orders',
        },
      },
      good_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'goods',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.STRING,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'OrderDetail',
      tableName: 'order_details',
    },
  );
  return OrderDetail;
};
