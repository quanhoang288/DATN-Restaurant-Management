const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      models.Order.belongsTo(models.ReservationTable, {
        as: 'reservationTable',
        foreignKey: 'reservation_table_id',
      });
      models.Order.belongsTo(models.Branch, {
        as: 'branch',
        foreignKey: 'branch_id',
      });

      models.Order.belongsTo(models.Customer, {
        as: 'customer',
        foreignKey: 'customer_id',
      });

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
      models.Order.belongsToMany(models.DiscountConstraint, {
        as: 'discountConstraints',
        through: {
          model: models.OrderDiscount,
        },
      });
      models.Order.belongsTo(models.DeliveryInfo, {
        as: 'deliveryInfo',
        foreignKey: 'delivery_info_id',
      });
      models.Order.belongsTo(models.Order, {
        as: 'parent',
        foreignKey: 'parent_id',
      });
      models.Order.hasMany(models.Order, {
        as: 'subOrders',
        foreignKey: 'parent_id',
      });
      models.Order.hasOne(models.Invoice, {
        as: 'invoice',
        foreignKey: 'order_id',
      });
    }
  }

  Order.init(
    {
      ...id(DataTypes),
      parent_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'orders',
        },
      },
      reservation_table_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'reservation_tables',
        },
      },
      branch_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'branches',
        },
      },
      delivery_info_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'delivery_infos',
        },
      },
      customer_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'customers',
        },
      },
      shipper_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'staff',
        },
      },
      customer_name: {
        type: DataTypes.STRING,
      },
      customer_phone_number: {
        type: DataTypes.STRING,
      },
      delivery_address: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'dine-in',
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        // pending, accepted, rejected
      },
      delivery_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        // pending, accepted, rejected, delivering, delivered
      },
      prepare_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        // pending, in_progress, ready_to_serve
      },
      payment_status: {
        type: DataTypes.STRING,
        // null, request_to_pay, paid
      },
      note: {
        type: DataTypes.STRING,
      },
      reject_reason: {
        type: DataTypes.STRING,
      },
      prepare_reject_reason: {
        type: DataTypes.STRING,
      },
      created_by_customer: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
    },
  );
  return Order;
};
