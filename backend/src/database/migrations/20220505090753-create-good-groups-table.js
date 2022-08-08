const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('good_groups', {
      ...id(Sequelize.DataTypes),
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('good_groups');
  },
};
