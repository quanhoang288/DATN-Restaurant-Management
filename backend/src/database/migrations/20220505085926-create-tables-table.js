const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tables', {
      ...id(Sequelize.DataTypes),
      branch_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'branches',
          },
        },
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      floor_num: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      order: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tables');
  },
};
