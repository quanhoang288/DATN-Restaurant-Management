const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kitchen_good', {
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
      kitchen_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'kitchens',
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
    await queryInterface.dropTable('kitchen_good');
  },
};
