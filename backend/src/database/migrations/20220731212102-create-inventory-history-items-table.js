const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_history_items', {
      ...id(Sequelize.DataTypes),
      inventory_history_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'inventory_histories',
          },
          allowNull: false,
        },
      },
      good_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'goods',
          },
          allowNull: false,
        },
      },
      unit_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'units',
          },
          allowNull: false,
        },
      },
      unit_price: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventory_history_items');
  },
};
