const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      ...id(Sequelize.DataTypes),
      dining_fee: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      other_fee: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      paid_amount: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
      },
      payment_status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invoices');
  },
};
