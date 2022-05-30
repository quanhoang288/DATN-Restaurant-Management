const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attribute_values', {
      ...id(Sequelize.DataTypes),
      attribute_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'good_attributes',
          },
          key: 'id',
        },
      },
      value: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attribute_values');
  },
};
