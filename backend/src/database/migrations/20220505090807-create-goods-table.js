const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('goods', {
      ...id(Sequelize.DataTypes),
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
      },
      import_price: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      sale_price: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
      },
      min_quantity_threshold: {
        type: Sequelize.DataTypes.INTEGER,
      },
      max_quantity_threshold: {
        type: Sequelize.DataTypes.INTEGER,
      },
      is_sold_directly: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_topping: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      usage_period_in_days: {
        type: Sequelize.DataTypes.INTEGER,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('goods');
  },
};
