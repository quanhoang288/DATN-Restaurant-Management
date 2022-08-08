const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('delivery_infos', {
      ...id(Sequelize.DataTypes),
      customer_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'discounts',
          },
          key: 'id',
        },
      },
      delivery_address: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      is_default: {
        type: Sequelize.DataTypes.TINYINT,
        defaultValue: 0,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('delivery_infos');
  },
};
