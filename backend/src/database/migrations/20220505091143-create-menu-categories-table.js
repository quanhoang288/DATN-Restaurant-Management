const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menu_categories', {
      ...id(Sequelize.DataTypes),
      menu_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'menus',
          },
          key: 'id',
        },
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: Sequelize.DataTypes.INTEGER,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('menu_categories');
  },
};
