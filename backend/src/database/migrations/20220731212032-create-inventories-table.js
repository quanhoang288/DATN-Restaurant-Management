const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventories', {
      ...id(Sequelize.DataTypes),
      branch_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'branches',
          },
          allowNull: false,
        },
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
    await queryInterface.dropTable('inventories');
  },
};
