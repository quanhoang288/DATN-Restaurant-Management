'use strict';
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
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      min_value: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      discount_method: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      discount_amount: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      discount_unit: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
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
