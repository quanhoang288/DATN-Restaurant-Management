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
      date_of_birth: {
        type: Sequelize.DataTypes.DATE,
      },
      phone_number: {
        type: Sequelize.DataTypes.STRING,
      },
      address: {
        type: Sequelize.DataTypes.STRING,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  },
};
