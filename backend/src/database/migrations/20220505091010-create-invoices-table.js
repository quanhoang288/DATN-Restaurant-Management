const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      ...id(Sequelize.DataTypes),
      order_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'orders',
          },
        },
      },
      other_fee: {
        type: Sequelize.DataTypes.INTEGER,
      },
      paid_amount: {
        type: Sequelize.DataTypes.INTEGER,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invoices');
  },
};
