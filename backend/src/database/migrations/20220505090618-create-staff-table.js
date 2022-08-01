const { id } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff', {
      ...id(Sequelize.DataTypes, {
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
      }),
      role_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'roles',
          },
        },
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staff');
  },
};
