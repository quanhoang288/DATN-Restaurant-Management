const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      ...id(Sequelize.DataTypes, {
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
      }),
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  },
};
