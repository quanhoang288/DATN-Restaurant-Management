const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('good_unit', {
      ...id(Sequelize.DataTypes),
      good_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'goods',
          },
        },
        allowNull: false,
      },
      unit_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'units',
          },
        },
        allowNull: false,
      },
      unit_cost: {
        type: Sequelize.DataTypes.INTEGER,
      },
      multiplier: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('good_unit');
  },
};
