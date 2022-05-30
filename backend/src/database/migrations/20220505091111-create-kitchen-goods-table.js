const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kitchen_goods', {
      ...id(Sequelize.DataTypes),
      kitchen_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'kitchens',
          },
          key: 'id',
        },
        allowNull: false,
      },
      good_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'goods',
          },
          key: 'id',
        },
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kitchen_goods');
  },
};
