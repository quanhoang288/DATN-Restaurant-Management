const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notification_templates', {
      ...id(Sequelize.DataTypes),
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notification_templates');
  },
};
