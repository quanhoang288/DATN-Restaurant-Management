const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_histories', {
      ...id(Sequelize.DataTypes),
      source_inventory_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'inventories',
          },
        },
      },
      target_inventory_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'inventories',
          },
        },
      },
      kitchen_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'kitchens',
          },
        },
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'provider',
      },
      provider: {
        type: Sequelize.DataTypes.STRING,
      },
      import_time: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: Sequelize.DataTypes.STRING,
      },
      discount: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventory_histories');
  },
};
