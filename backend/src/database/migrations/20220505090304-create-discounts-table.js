const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('discounts', {
      ...id(Sequelize.DataTypes),
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DataTypes.DATE,
      },
      end_date: {
        type: Sequelize.DataTypes.DATE,
      },
      start_day: {
        type: Sequelize.DataTypes.INTEGER,
      },
      end_day: {
        type: Sequelize.DataTypes.INTEGER,
      },
      start_hour: {
        type: Sequelize.DataTypes.TIME,
      },
      end_hour: {
        type: Sequelize.DataTypes.TIME,
      },
      method: {
        type: Sequelize.DataTypes.STRING,
      },
      is_applied_to_all_customers: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_auto_applied: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('discounts');
  },
};
