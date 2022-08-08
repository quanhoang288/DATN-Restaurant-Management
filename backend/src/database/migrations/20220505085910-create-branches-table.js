const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('branches', {
      ...id(Sequelize.DataTypes),
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('branches');
  },
};
