const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('discount_constraints', {
      ...id(Sequelize.DataTypes),
      discount_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'discounts',
          },
          key: 'id',
        },
        allowNull: false,
      },
      min_invoice_value: {
        type: Sequelize.DataTypes.INTEGER,
      },
      discount_amount: {
        type: Sequelize.DataTypes.INTEGER,
      },
      discount_unit: {
        type: Sequelize.DataTypes.STRING,
      },
      order_item_quantity: {
        type: Sequelize.DataTypes.INTEGER,
      },
      discount_item_quantity: {
        type: Sequelize.DataTypes.INTEGER,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('discount_constraints');
  },
};
