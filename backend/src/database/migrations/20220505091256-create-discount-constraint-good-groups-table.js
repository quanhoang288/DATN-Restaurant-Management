'use strict';
const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('discount_constraint_good_groups', {
      ...id(Sequelize.DataTypes),
      discount_constraint_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'discount_constraints',
          },
          key: 'id',
        },
      },
      good_group_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'good_groups',
          },
          key: 'id',
        },
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('discount_constraint_good_groups');
  },
};
