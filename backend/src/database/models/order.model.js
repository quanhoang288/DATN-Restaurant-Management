const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      models.Order.belongsTo(models.ReservationTable, {
        as: 'reservationTable',
        foreignKey: 'reservation_table_id',
      });
      // models.Order.belongsTo(models.Invoice, {
      //   as: 'invoice',
      //   foreignKey: 'invoice_id',
      // });
      models.Order.hasMany(models.OrderDetail, {
        as: 'details',
        foreignKey: 'order_id',
      });
      models.Order.belongsToMany(models.Good, {
        as: 'goods',
        through: {
          model: models.OrderDetail,
        },
      });
      models.Order.hasMany(models.OrderDiscount, {
        as: 'orderDiscounts',
        foreignKey: 'order_id',
      });
      models.Order.belongsToMany(models.Discount, {
        as: 'discounts',
        through: {
          model: models.OrderDiscount,
        },
      });
      models.Order.belongsTo(models.DeliveryInfo, {
        as: 'deliveryInfo',
        foreignKey: 'delivery_info_id',
      });
    }
  }

  Order.init(
    {
      ...id(DataTypes),
      reservation_table_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'reservation_tables',
        },
      },
      invoice_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'invoices',
        },
      },
      delivery_info_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'delivery_infos',
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
      },
      note: {
        type: DataTypes.STRING,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
    },
  );
  return Order;
};
