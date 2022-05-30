'use strict';
const { id, timeStamp } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff', {
      ...id(Sequelize.DataTypes, {
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
      }),
      status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staff');
  },
};
