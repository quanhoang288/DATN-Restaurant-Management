const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_transactions', {
      ...id(Sequelize.DataTypes),
      invoice_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'invoices',
          },
          key: 'id',
        },
      },
      content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payment_transactions');
  },
};
