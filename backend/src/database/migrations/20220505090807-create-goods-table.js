const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('goods', {
      ...id(Sequelize.DataTypes),
      good_group_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'good_groups',
          },
        },
      },
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
      image: {
        type: Sequelize.DataTypes.STRING,
      },
      sale_price: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
      },
      delivery_sale_price: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
      },

      min_quantity_threshold: {
        type: Sequelize.DataTypes.INTEGER,
      },
      max_quantity_threshold: {
        type: Sequelize.DataTypes.INTEGER,
      },
      is_sold_directly: {
        type: Sequelize.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      is_available: {
        type: Sequelize.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
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
