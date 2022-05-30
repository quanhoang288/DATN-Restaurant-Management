'use strict';
const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menu_categories', {
      ...id(Sequelize.DataTypes),
      order_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'orders',
          },
          key: 'id',
        },
      },
      good_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'goods',
          },
          key: 'id',
        },
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('menu_categories');
  },
};
