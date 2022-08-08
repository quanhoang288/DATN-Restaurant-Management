const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('good_attributes', {
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
      attribute_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'attributes',
          },
        },
        allowNull: false,
      },
      value: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('good_attributes');
  },
};
