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
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  },
};
