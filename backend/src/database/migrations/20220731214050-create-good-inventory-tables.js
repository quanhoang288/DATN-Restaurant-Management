const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('good_inventory', {
      ...id(Sequelize.DataTypes),
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
      inventory_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'inventories',
          },
          allowNull: false,
        },
      },
      quantity: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('good_inventory');
  },
};
