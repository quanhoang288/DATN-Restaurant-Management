const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      ...id(Sequelize.DataTypes),
      code: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  },
};
