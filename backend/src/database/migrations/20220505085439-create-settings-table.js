const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('settings', {
      ...id(Sequelize.DataTypes),
      name: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      value: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('settings');
  },
};
