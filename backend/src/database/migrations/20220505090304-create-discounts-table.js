const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('discounts', {
      ...id(Sequelize.DataTypes),
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
      },
      image: {
        type: Sequelize.DataTypes.STRING,
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
      method: {
        type: Sequelize.DataTypes.STRING,
      },
      is_auto_applied: {
        type: Sequelize.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('discounts');
  },
};
