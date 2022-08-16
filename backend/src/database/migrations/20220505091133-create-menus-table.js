const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menus', {
      ...id(Sequelize.DataTypes),
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.DataTypes.STRING,
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
    await queryInterface.dropTable('menus');
  },
};
