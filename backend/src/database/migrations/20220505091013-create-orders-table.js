const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      ...id(Sequelize.DataTypes),
      reservation_table_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'reservation_tables',
          },
          key: 'id',
        },
      },
      kitchen_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'kitchens',
          },
          key: 'id',
        },
      },
      invoice_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'invoices',
          },
          key: 'id',
        },
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
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
