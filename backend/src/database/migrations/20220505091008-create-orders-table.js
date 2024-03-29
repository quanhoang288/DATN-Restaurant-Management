const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      ...id(Sequelize.DataTypes),
      parent_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'orders',
          },
        },
      },
      reservation_table_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'reservation_tables',
          },
        },
      },
      branch_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'branches',
          },
        },
      },
      customer_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'customers',
        },
      },
      delivery_info_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'delivery_infos',
        },
      },
      shipper_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'staff',
        },
      },
      customer_name: {
        type: Sequelize.DataTypes.STRING,
      },
      customer_phone_number: {
        type: Sequelize.DataTypes.STRING,
      },
      delivery_address: {
        type: Sequelize.DataTypes.STRING,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'dine-in',
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        // pending, accepted, rejected
      },
      delivery_status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        // pending, accepted, rejected, delivering, delivered
      },
      prepare_status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      payment_status: {
        type: Sequelize.DataTypes.STRING,
      },
      note: {
        type: Sequelize.DataTypes.STRING,
      },
      reject_reason: {
        type: Sequelize.DataTypes.STRING,
      },
      prepare_reject_reason: {
        type: Sequelize.DataTypes.STRING,
      },
      created_by_customer: {
        type: Sequelize.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  },
};
