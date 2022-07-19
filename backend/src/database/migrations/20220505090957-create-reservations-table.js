const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservations', {
      ...id(Sequelize.DataTypes),
      customer_id: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: 'customers',
          },
          key: 'id',
        },
      },
      arrive_time: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      num_people: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      customer_name: {
        type: Sequelize.DataTypes.STRING,
      },
      customer_phone_number: {
        type: Sequelize.DataTypes.STRING,
      },
      note: {
        type: Sequelize.DataTypes.STRING,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reservations');
  },
};
