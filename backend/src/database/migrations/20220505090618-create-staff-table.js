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
      branch_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'branches',
          },
        },
      },
      role_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'roles',
          },
        },
      },
      is_active: {
        type: Sequelize.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staff');
  },
};
