const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('discount_time_slots', {
      ...id(Sequelize.DataTypes),
      discount_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'discounts',
          },
        },
        allowNull: false,
      },
      start_time: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('discount_time_slots');
  },
};
