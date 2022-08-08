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
      type: {
        type: Sequelize.DataTypes.STRING,
      },
      import_price: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
      },
      sale_price: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
      },

      min_quantity_threshold: {
        type: Sequelize.DataTypes.INTEGER,
      },
      max_quantity_threshold: {
        type: Sequelize.DataTypes.INTEGER,
      },
      manufacture_date: {
        type: Sequelize.DataTypes.DATE,
      },
      expires_in_days: {
        type: Sequelize.DataTypes.INTEGER,
      },
      expires_at: {
        type: Sequelize.DataTypes.INTEGER,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('goods');
  },
};
